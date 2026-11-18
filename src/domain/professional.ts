import {requireValue as need} from '../../vendor/project-store.ts';
import {artifact,hash} from './artifact.ts';
import {escapeHTML as esc,htmlPage} from './presentation.ts';
import {readBlob} from './media.ts';
const find=(rows:any[],id:string,label:string)=>{const v=rows.find(x=>x.id===id);need(v,label+'不存在。');return v;};
const unique=(ids:string[],label:string)=>need(new Set(ids).size===ids.length,label+'不能重复。');
export function box(r:any){need(r.width>0&&r.height>0&&r.x+r.width<=1&&r.y+r.height<=1,'图像区域越界或为空。');}
export function contrast(a:string,b:string){
 const light=(hex:string)=>{need(/^#[0-9a-f]{6}$/i.test(hex),'色值须为六位HEX。');const v=[1,3,5].map(at=>parseInt(hex.slice(at,at+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
 const x=light(a),y=light(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
export function paletteReport(p:any,id:string){const palette=find(p.palettes,id,'色板'),pairs:any[]=[];for(let a=0;a<palette.swatches.length;a++)for(let b=a+1;b<palette.swatches.length;b++){const x=palette.swatches[a],y=palette.swatches[b],ratio=contrast(x.hex,y.hex);pairs.push({from:x.name,to:y.name,ratio:Number(ratio.toFixed(3)),normal_text_AA:ratio>=4.5,large_text_AA:ratio>=3});}return {title:palette.title,pairs,formula:'WCAG相对亮度；sRGB阈值0.04045，(Lmax+0.05)/(Lmin+0.05)',note:'仅计算两色对比，不评定美术质量、人物一致性或画面最终可读性。'};}
export function imageHeader(b:Buffer){
 let width=0,height=0,type='';
 if(b.length>=33&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))){need(b.toString('ascii',12,16)==='IHDR'&&b.subarray(-12,-8).readUInt32BE(0)===0&&b.toString('ascii',b.length-8,b.length-4)==='IEND','PNG结构不完整。');width=b.readUInt32BE(16);height=b.readUInt32BE(20);type='png';}
 else if(b.length>=4&&b[0]===255&&b[1]===216&&b[b.length-2]===255&&b[b.length-1]===217){type='jpeg';let at=2;while(at+4<=b.length){need(b[at]===255,'JPEG标记无效。');while(b[at]===255)at++;const marker=b[at++];if(marker===0xda||marker===0xd9)break;const len=b.readUInt16BE(at);need(len>=2&&at+len<=b.length,'JPEG片段截断。');if([0xc0,0xc1,0xc2].includes(marker)){need(len>=8,'JPEG尺寸缺失。');height=b.readUInt16BE(at+3);width=b.readUInt16BE(at+5);}at+=len;}}
 need(type&&width>0&&height>0&&width*height<=80000000,'仅支持结构完整、尺寸有效的PNG/JPEG，最多8000万像素。');return {type,width,height};
}
export function validateDomain(p:any){
 for(const ref of p.references)if(ref.crop)box(ref.crop);
 for(const board of p.boards){unique(board.reference_ids,'参考板图像');for(const id of board.reference_ids)find(p.references,id,'参考图');}
 for(const palette of p.palettes)unique(palette.swatches.map((s:any)=>s.id),'色板色块');
 for(const d of p.designs){unique(d.reference_ids,'方案参考图');for(const id of d.reference_ids)find(p.references,id,'方案参考图');if(d.palette_id!==null)find(p.palettes,d.palette_id,'方案色板');}
 for(const n of p.notes){find(p.references,n.reference_id,'意见图像');box(n.region);need(n.status!=='resolved'||n.resolution.trim(),'解决意见须说明处理结果。');}
}
export async function checkSources(p:any,sources:any[],_request:any){for(const r of p.references)need(sources[r.asset_source_index]?.source_ref?.kind==='asset','参考图须关联当前作品的固定素材。');}
export async function loadImages(p:any,sources:any[],request:any,ids?:string[]){
 const references=p.references.filter((r:any)=>!ids||ids.includes(r.id)),cache=new Map<number,any>(),images:any[]=[];let total=0;
 for(const ref of references){let value=cache.get(ref.asset_source_index);if(!value){const source=sources[ref.asset_source_index]?.source_ref;const bytes=await readBlob(source,request,2*1024*1024);total+=bytes.length;need(total<=8*1024*1024,'参考板实际图像超过8MiB，请拆分参考板。','hetu.budget_exceeded');value={...imageHeader(bytes),file_sha256:hash(bytes),data:'data:image/'+imageHeader(bytes).type+';base64,'+bytes.toString('base64')};cache.set(ref.asset_source_index,value);}images.push({reference:ref,...value});}return images;
}
export async function renderBoard(p:any,sources:any[],request:any,id:string){
 const board=find(p.boards,id,'参考板'),images=await loadImages(p,sources,request,board.reference_ids);
 const body=board.reference_ids.map((id:string)=>{const image=find(images.map(v=>({...v,id:v.reference.id})),id,'参考图'),r=image.reference,c=r.crop??{x:0,y:0,width:1,height:1};return `<figure><div class="crop" style="aspect-ratio:${image.width*c.width}/${image.height*c.height}"><img src="${image.data}" alt="${esc(r.title)}" style="width:${100/c.width}%;height:${100/c.height}%;left:${-c.x/c.width*100}%;top:${-c.y/c.height*100}%"></div><figcaption><strong>${esc(r.title)}</strong> ${r.role==='reference'?'参考':'设计'}<p>${esc(r.notes)}</p></figcaption></figure>`;}).join('');
 return htmlPage(board.title,`<style>.board{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:20px}.board figure{margin:0}.crop{position:relative;overflow:hidden;background:#eee}.crop img{position:absolute;max-width:none;object-fit:fill}figcaption{padding:8px 0}figcaption p{white-space:pre-wrap}</style><h1>${esc(board.title)}</h1><p>${esc(board.purpose)}</p><div class="board">${body}</div><p>固定素材的专业参考板，素材权利与正式选用独立决定。</p>`);
}
export async function pureAction(_a:string,_i:any){return undefined;}
export async function writeProfessional(_a:string,_p:any,_s:any[],_i:any,_request:any){need(false,'未知专业写动作。');}
export async function readProfessional(a:string,p:any,s:any[],i:any,r:any):Promise<any>{
 if(a==='palette_contrast')return paletteReport(p,i.palette_id);
 if(a==='render_board'||a==='export_board')return artifact(await renderBoard(p,s,r,i.board_id),'美术参考板.html','text/html',i);
 if(a==='check_designs'){const images=await loadImages(p,s,r);return {images:images.map(v=>({reference_id:v.reference.id,title:v.reference.title,type:v.type,width:v.width,height:v.height,file_sha256:v.file_sha256})),stale_notes:p.notes.filter((n:any)=>images.find(v=>v.reference.id===n.reference_id)?.file_sha256!==n.asset_sha256).map((n:any)=>n.id),unreferenced_image_ids:p.references.filter((x:any)=>!p.boards.some((b:any)=>b.reference_ids.includes(x.id))&&!p.designs.some((d:any)=>d.reference_ids.includes(x.id))).map((x:any)=>x.id),note:'图像结构及摘要已核对；完整解码、实际观看和作者认可分别判断。'};}
 if(a==='compare_designs'){const from=find(p.designs,i.from_design_id,'原方案'),to=find(p.designs,i.to_design_id,'目标方案');return {from,to,changes:Object.keys(from).filter(k=>JSON.stringify(from[k])!==JSON.stringify(to[k])),note:'并列差异不自动评定优劣。'};}
 if(a==='locate_reference'){const ref=find(p.references,i.reference_id,'参考图');return {reference:ref,source_ref:s[ref.asset_source_index]?.source_ref,notes:p.notes.filter((n:any)=>n.reference_id===ref.id)};}
}
export function summaries(p:any){return [{title:'参考板',lines:p.boards.map((b:any)=>`${b.title}：${b.purpose}`)},{title:'图像职责',lines:p.references.map((r:any)=>`${r.title}（${r.role==='reference'?'参考':'设计'}）：${r.notes}`)},{title:'造型方案',lines:p.designs.map((d:any)=>`${d.title}：${d.requirements.join('；')}`)},{title:'审阅意见',lines:p.notes.map((n:any)=>n.comment)}];}

export function validateTransition(_next:any,_previous:any){}
