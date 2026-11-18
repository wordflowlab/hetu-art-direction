import {createHash} from "node:crypto";
import {newProject} from "../../src/domain/model.ts";
export const original="林溪在雨港邮局等信。\n她把旧钥匙放进信封。\n\n第二天，她决定出发。\n";
export const sha=(v:string|Uint8Array)=>createHash("sha256").update(v).digest("hex");
export const sourceRef={kind:"document",work_ref:{workspace_id:"workspace_test",kind:"novel",object_id:"novel_test"},document_id:"doc_11111111-1111-4111-8111-111111111111",revision_id:"rev_11111111-1111-4111-8111-111111111111",sha256:sha(original)};
export const range={source_index:0,byte_start:0,byte_end:Buffer.byteLength(original),quote:original};
export const base=(r:any,key:string)=>({object_id:r.object.object_id,expected_revision:r.object.revision,expected_sha256:r.sha256,operation_key:key});
export const selection=(r:any)=>({object_id:r.object.object_id,revision:r.object.revision});
export function wav(value=6000,frames=800,rate=8000){const b=Buffer.alloc(44+frames*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(frames*2,40);for(let n=0;n<frames;n++)b.writeInt16LE(value,44+n*2);return b;}

export function scenario(_work:any=sourceRef.work_ref):any {const p={...newProject("雨港来信"),...{
  "references": [],
  "boards": [
    {
      "id": "harbour-board",
      "title": "雨港旧站 氛围与造型",
      "purpose": "雨幕、旧木、铜钥匙；人物形象与气氛参考分开。",
      "reference_ids": []
    }
  ],
  "palettes": [
    {
      "id": "rain",
      "title": "纸色与雨港灰",
      "swatches": [
        {
          "id": "paper",
          "name": "旧信纸",
          "hex": "#F2E9DA",
          "role": "信封与纸面"
        },
        {
          "id": "rain",
          "name": "雨幕",
          "hex": "#536C6E",
          "role": "远景雨幕"
        },
        {
          "id": "ink",
          "name": "墨色",
          "hex": "#202B2D",
          "role": "文字及轮廓"
        }
      ]
    }
  ],
  "designs": [
    {
      "id": "coat-one",
      "title": "林溪 雨披方案",
      "kind": "costume",
      "entity_ref": null,
      "reference_ids": [],
      "palette_id": "rain",
      "requirements": [
        "保留旧信封的纸色",
        "肩部雨水与人物轮廓清楚"
      ],
      "status": "proposed"
    },
    {
      "id": "coat-two",
      "title": "林溪 短外套方案",
      "kind": "costume",
      "entity_ref": null,
      "reference_ids": [],
      "palette_id": "rain",
      "requirements": [
        "轻便短外套",
        "铜钥匙只作局部强调"
      ],
      "status": "proposed"
    }
  ],
  "notes": []
}};
return p;}
