import wasmImport from "../wasm";
export let wasm: any = undefined;
export async function init() {
  wasm = await wasmImport("modular/manin-symbols");
}
init();

// @ts-ignore
const registry = new FinalizationRegistry((handle) => {
  wasm.exports.EllipticCurve_free(handle);
});

class EllipticCurveClass {
  private readonly handle: number;

  constructor(ainvs: number[] | string) {
    if (typeof ainvs == "string") {
      if (ainvs[ainvs.length - 1] < "0" || ainvs[ainvs.length - 1] > "9") {
        ainvs += "1"; //  default is optimal
      }
      ainvs = CREMONA[ainvs];
      if (typeof ainvs == "string") {
        throw Error("bug");
      }
    }
    if (ainvs.length == 2) {
      ainvs = [0, 0, 0, ...ainvs];
    } else if (ainvs.length != 5) {
      throw Error("ainvs must be of length 2 or 5");
    }
    this.handle = wasm.exports.EllipticCurve_init(...ainvs);
  }

  __repr__(): string {
    wasm.exports.EllipticCurve_format(this.handle);
    return wasm.result;
  }

  toJSON(): { type: "EllipticCurve"; ainvs: [0, -1, 1, -10, -20] } {
    wasm.exports.EllipticCurve_stringify(this.handle);
    return JSON.parse(wasm.result);
  }

  ap(p: number): number {
    return wasm.exports.EllipticCurve_ap(this.handle, p);
  }

  anlist(n: number): number[] {
    wasm.exports.EllipticCurve_anlist(this.handle, n);
    return eval(wasm.result);
  }

  aplist(n: number): number[] {
    wasm.exports.EllipticCurve_aplist(this.handle, n);
    return eval(wasm.result);
  }

  analyticRank(bitPrecision = 53): number {
    console.log("warning: analyticRank doesn't work at all!");
    return wasm.exports.EllipticCurve_analyticRank(this.handle, bitPrecision);
  }

  conductor(): number {
    return wasm.exports.EllipticCurve_conductor(this.handle);
  }

  root_number(): -1 | 1 {
    return wasm.exports.EllipticCurve_root_number(this.handle);
  }
}

export function EllipticCurve(ainvs) {
  return new EllipticCurveClass(ainvs);
}

// Cremona optimal curves to confuctor 500...
// v = [[E.cremona_label(), [int(x) for x in E.ainvs()]] for E in cremona_optimal_curves(range(500))]
// z = json.dumps(dict(v)).replace(' ','')
// Will likely replace by something else at some point...
const CREMONA = JSON.parse(
  '{"11a1":[0,-1,1,-10,-20],"14a1":[1,0,1,4,-6],"15a1":[1,1,1,-10,-10],"17a1":[1,-1,1,-1,-14],"19a1":[0,1,1,-9,-15],"20a1":[0,1,0,4,4],"21a1":[1,0,0,-4,-1],"24a1":[0,-1,0,-4,4],"26a1":[1,0,1,-5,-8],"26b1":[1,-1,1,-3,3],"27a1":[0,0,1,0,-7],"30a1":[1,0,1,1,2],"32a1":[0,0,0,4,0],"33a1":[1,1,0,-11,0],"34a1":[1,0,0,-3,1],"35a1":[0,1,1,9,1],"36a1":[0,0,0,0,1],"37a1":[0,0,1,-1,0],"37b1":[0,1,1,-23,-50],"38a1":[1,0,1,9,90],"38b1":[1,1,1,0,1],"39a1":[1,1,0,-4,-5],"40a1":[0,0,0,-7,-6],"42a1":[1,1,1,-4,5],"43a1":[0,1,1,0,0],"44a1":[0,1,0,3,-1],"45a1":[1,-1,0,0,-5],"46a1":[1,-1,0,-10,-12],"48a1":[0,1,0,-4,-4],"49a1":[1,-1,0,-2,-1],"50a1":[1,0,1,-1,-2],"50b1":[1,1,1,-3,1],"51a1":[0,1,1,1,-1],"52a1":[0,0,0,1,-10],"53a1":[1,-1,1,0,0],"54a1":[1,-1,0,12,8],"54b1":[1,-1,1,1,-1],"55a1":[1,-1,0,-4,3],"56a1":[0,0,0,1,2],"56b1":[0,-1,0,0,-4],"57a1":[0,-1,1,-2,2],"57b1":[1,0,1,-7,5],"57c1":[0,1,1,20,-32],"58a1":[1,-1,0,-1,1],"58b1":[1,1,1,5,9],"61a1":[1,0,0,-2,1],"62a1":[1,-1,1,-1,1],"63a1":[1,-1,0,9,0],"64a1":[0,0,0,-4,0],"65a1":[1,0,0,-1,0],"66a1":[1,0,1,-6,4],"66b1":[1,1,1,-2,-1],"66c1":[1,0,0,-45,81],"67a1":[0,1,1,-12,-21],"69a1":[1,0,1,-1,-1],"70a1":[1,-1,1,2,-3],"72a1":[0,0,0,6,-7],"73a1":[1,-1,0,4,-3],"75a1":[0,-1,1,-8,-7],"75b1":[1,0,1,-1,23],"75c1":[0,1,1,2,4],"76a1":[0,-1,0,-21,-31],"77a1":[0,0,1,2,0],"77b1":[0,1,1,-49,600],"77c1":[1,1,0,4,11],"78a1":[1,1,0,-19,685],"79a1":[1,1,1,-2,0],"80a1":[0,0,0,-7,6],"80b1":[0,-1,0,4,-4],"82a1":[1,0,1,-2,0],"83a1":[1,1,1,1,0],"84a1":[0,1,0,7,0],"84b1":[0,-1,0,-1,-2],"85a1":[1,1,0,-8,-13],"88a1":[0,0,0,-4,4],"89a1":[1,1,1,-1,0],"89b1":[1,1,0,4,5],"90a1":[1,-1,0,6,0],"90b1":[1,-1,1,-8,11],"90c1":[1,-1,1,13,-61],"91a1":[0,0,1,1,0],"91b1":[0,1,1,-7,5],"92a1":[0,1,0,2,1],"92b1":[0,0,0,-1,1],"94a1":[1,-1,1,0,-1],"96a1":[0,1,0,-2,0],"96b1":[0,-1,0,-2,0],"98a1":[1,1,0,-25,-111],"99a1":[1,-1,1,-2,0],"99b1":[1,-1,1,-59,186],"99c1":[1,-1,0,-15,8],"99d1":[0,0,1,-3,-5],"100a1":[0,-1,0,-33,62],"101a1":[0,1,1,-1,-1],"102a1":[1,1,0,-2,0],"102b1":[1,0,0,-34,68],"102c1":[1,0,1,-256,1550],"104a1":[0,1,0,-16,-32],"105a1":[1,0,1,-3,1],"106a1":[1,0,0,1,1],"106b1":[1,1,0,-7,5],"106c1":[1,0,0,-283,-2351],"106d1":[1,1,0,-27,-67],"108a1":[0,0,0,0,4],"109a1":[1,-1,0,-8,-7],"110a1":[1,1,1,10,-45],"110b1":[1,0,0,-1,1],"110c1":[1,0,1,-89,316],"112a1":[0,1,0,0,4],"112b1":[0,0,0,1,-2],"112c1":[0,-1,0,-8,-16],"113a1":[1,1,1,3,-4],"114a1":[1,0,0,-8,0],"114b1":[1,1,0,-95,-399],"114c1":[1,1,1,-352,-2431],"115a1":[0,0,1,7,-11],"116a1":[0,0,0,-4831,-129242],"116b1":[0,1,0,-4,4],"116c1":[0,-1,0,-4,24],"117a1":[1,-1,1,4,6],"118a1":[1,1,0,1,1],"118b1":[1,1,1,-25,39],"118c1":[1,1,1,-4,-5],"118d1":[1,1,0,56,-192],"120a1":[0,1,0,-15,18],"120b1":[0,1,0,4,0],"121a1":[1,1,1,-30,-76],"121b1":[0,-1,1,-7,10],"121c1":[1,1,0,-2,-7],"121d1":[0,-1,1,-40,-221],"122a1":[1,0,1,2,0],"123a1":[0,1,1,-10,10],"123b1":[0,-1,1,1,-1],"124a1":[0,1,0,-2,1],"124b1":[0,0,0,-17,-27],"126a1":[1,-1,1,-5,-7],"126b1":[1,-1,0,-36,-176],"128a1":[0,1,0,1,1],"128b1":[0,1,0,3,-5],"128c1":[0,-1,0,1,-1],"128d1":[0,-1,0,3,5],"129a1":[0,-1,1,-19,39],"129b1":[1,0,1,-30,-29],"130a1":[1,0,1,-33,68],"130b1":[1,-1,1,-7,-1],"130c1":[1,1,1,-841,-9737],"131a1":[0,-1,1,1,0],"132a1":[0,1,0,3,0],"132b1":[0,-1,0,-77,330],"135a1":[0,0,1,-3,4],"135b1":[0,0,1,-27,-115],"136a1":[0,1,0,-4,0],"136b1":[0,-1,0,-8,-4],"138a1":[1,1,0,-1,1],"138b1":[1,0,1,-36,82],"138c1":[1,1,1,3,3],"139a1":[1,1,0,-3,-4],"140a1":[0,1,0,-5,-25],"140b1":[0,0,0,32,212],"141a1":[0,1,1,-12,2],"141b1":[1,1,1,-8,-16],"141c1":[1,0,0,-2,3],"141d1":[0,-1,1,-1,0],"141e1":[0,1,1,-26,-61],"142a1":[1,-1,1,-12,15],"142b1":[1,1,0,-1,-1],"142c1":[1,-1,0,-1,-3],"142d1":[1,0,0,-8,8],"142e1":[1,-1,0,-2626,52244],"143a1":[0,-1,1,-1,-2],"144a1":[0,0,0,0,-1],"144b1":[0,0,0,6,7],"145a1":[1,-1,1,-3,2],"147a1":[1,1,1,48,48],"147b1":[0,1,1,-114,473],"147c1":[0,-1,1,-2,-1],"148a1":[0,-1,0,-5,1],"150a1":[1,0,0,-3,-3],"150b1":[1,1,0,-75,-375],"150c1":[1,1,1,37,281],"152a1":[0,1,0,-1,3],"152b1":[0,1,0,-8,-16],"153a1":[0,0,1,-3,2],"153b1":[0,0,1,6,27],"153c1":[1,-1,0,-6,-1],"153d1":[0,0,1,-27,-61],"154a1":[1,-1,0,-29,69],"154b1":[1,-1,1,-4,-89],"154c1":[1,1,0,-14,-28],"155a1":[0,-1,1,10,6],"155b1":[1,1,1,-1,-2],"155c1":[0,-1,1,-1,1],"156a1":[0,-1,0,-5,6],"156b1":[0,1,0,-13,-4],"158a1":[1,-1,1,-9,9],"158b1":[1,1,0,-3,1],"158c1":[1,1,1,-420,3109],"158d1":[1,0,1,-82,-92],"158e1":[1,1,1,1,1],"160a1":[0,1,0,-6,4],"160b1":[0,-1,0,-6,-4],"161a1":[1,-1,1,-9,8],"162a1":[1,-1,0,-6,8],"162b1":[1,-1,1,-5,5],"162c1":[1,-1,0,3,-1],"162d1":[1,-1,1,4,-1],"163a1":[0,0,1,-2,1],"166a1":[1,1,0,-6,4],"168a1":[0,1,0,-7,-10],"168b1":[0,-1,0,-7,52],"170a1":[1,0,1,-8,6],"170b1":[1,0,1,-2554,49452],"170c1":[1,0,0,399,-919],"170d1":[1,0,1,-3,6],"170e1":[1,-1,0,-10,-10],"171a1":[1,-1,1,-14,20],"171b1":[0,0,1,6,0],"171c1":[0,0,1,177,1035],"171d1":[0,0,1,-21,-41],"172a1":[0,1,0,-13,15],"174a1":[1,0,1,-7705,1226492],"174b1":[1,0,0,-1,137],"174c1":[1,1,1,-5,-7],"174d1":[1,0,1,0,-2],"174e1":[1,1,0,-56,-192],"175a1":[0,-1,1,2,-2],"175b1":[0,-1,1,-33,93],"175c1":[0,1,1,42,-131],"176a1":[0,0,0,-4,-4],"176b1":[0,1,0,-5,-13],"176c1":[0,-1,0,3,1],"178a1":[1,0,0,6,-28],"178b1":[1,1,0,-44,80],"179a1":[0,0,1,-1,-1],"180a1":[0,0,0,-12,-11],"182a1":[1,-1,1,866,6445],"182b1":[1,0,0,7,-7],"182c1":[1,0,1,-4609,120244],"182d1":[1,-1,1,3,-5],"182e1":[1,-1,0,-22,884],"184a1":[0,-1,0,0,1],"184b1":[0,-1,0,-4,5],"184c1":[0,0,0,5,6],"184d1":[0,0,0,-55,-157],"185a1":[0,1,1,-156,700],"185b1":[0,-1,1,-5,6],"185c1":[1,0,1,-4,-3],"186a1":[1,1,0,-83,-369],"186b1":[1,0,0,15,9],"186c1":[1,0,1,-17,-28],"187a1":[0,1,1,11,30],"187b1":[0,0,1,7,1],"189a1":[0,0,1,-3,0],"189b1":[0,0,1,-24,45],"189c1":[0,0,1,-6,3],"189d1":[0,0,1,-27,-7],"190a1":[1,-1,1,-48,147],"190b1":[1,1,0,2,2],"190c1":[1,0,0,-30,-100],"192a1":[0,-1,0,-4,-2],"192b1":[0,1,0,-4,2],"192c1":[0,1,0,3,3],"192d1":[0,-1,0,3,-3],"194a1":[1,-1,1,-3,-1],"195a1":[1,0,0,-110,435],"195b1":[0,1,1,0,-1],"195c1":[0,1,1,-66,-349],"195d1":[0,-1,1,-190,1101],"196a1":[0,-1,0,-2,1],"196b1":[0,1,0,-114,-127],"197a1":[0,0,1,-5,4],"198a1":[1,-1,0,-18,4],"198b1":[1,-1,1,-50,-115],"198c1":[1,-1,1,-65,209],"198d1":[1,-1,0,-87,333],"198e1":[1,-1,0,-405,-2187],"200a1":[0,0,0,125,-1250],"200b1":[0,1,0,-3,-2],"200c1":[0,0,0,-50,125],"200d1":[0,-1,0,-83,-88],"200e1":[0,0,0,5,-10],"201a1":[0,-1,1,2,0],"201b1":[1,0,0,-1,2],"201c1":[1,1,0,-794,8289],"202a1":[1,-1,0,4,-176],"203a1":[0,-1,1,20,-8],"203b1":[1,1,1,0,-2],"203c1":[1,1,0,-9,8],"204a1":[0,-1,0,-1621,-24623],"204b1":[0,1,0,-5,-9],"205a1":[1,-1,1,-22,44],"205b1":[1,1,1,-21,-46],"205c1":[1,1,0,-2,-1],"206a1":[1,1,0,2,0],"207a1":[1,-1,1,-5,20],"208a1":[0,-1,0,8,-16],"208b1":[0,-1,0,-16,32],"208c1":[0,0,0,1,10],"208d1":[0,0,0,-43,-166],"209a1":[0,1,1,-27,55],"210a1":[1,0,0,-41,-39],"210b1":[1,0,1,-498,4228],"210c1":[1,1,1,10,-13],"210d1":[1,1,0,-3,-3],"210e1":[1,0,0,210,900],"212a1":[0,-1,0,-4,8],"212b1":[0,-1,0,-12,-40],"213a1":[1,0,1,0,1],"214a1":[1,0,0,-12,16],"214b1":[1,0,1,1,0],"214c1":[1,0,1,-193,1012],"214d1":[1,0,0,2,4],"215a1":[0,0,1,-8,-12],"216a1":[0,0,0,-12,20],"216b1":[0,0,0,-3,-34],"216c1":[0,0,0,-27,918],"216d1":[0,0,0,-108,-540],"218a1":[1,0,0,-2,4],"219a1":[0,-1,1,-6,8],"219b1":[0,1,1,3,2],"219c1":[1,1,0,-82,-305],"220a1":[0,1,0,-45,100],"220b1":[0,-1,0,-5,2],"221a1":[1,-1,1,-733,7804],"221b1":[1,1,0,-59,152],"222a1":[1,0,0,2,-4],"222b1":[1,1,1,17,179],"222c1":[1,1,0,16,0],"222d1":[1,0,1,1,-46],"222e1":[1,1,0,-182317,29887645],"224a1":[0,1,0,2,0],"224b1":[0,-1,0,2,0],"225a1":[0,0,1,0,1],"225b1":[0,0,1,0,156],"225c1":[1,-1,1,-5,-628],"225d1":[0,0,1,15,-99],"225e1":[0,0,1,-75,256],"226a1":[1,0,0,-5,1],"228a1":[0,-1,0,3,18],"228b1":[0,-1,0,3,9],"229a1":[1,0,0,-2,-1],"231a1":[1,1,1,-34,62],"232a1":[0,-1,0,8,-4],"232b1":[0,1,0,-80,-304],"233a1":[1,0,1,0,11],"234a1":[1,-1,0,-24,-64],"234b1":[1,-1,1,-29,-107],"234c1":[1,-1,0,-3,5],"234d1":[1,-1,1,-176,-18669],"234e1":[1,-1,1,4,-7],"235a1":[1,1,1,-5,0],"235b1":[1,1,1,-3551,-82926],"235c1":[0,-1,1,4,1],"236a1":[0,-1,0,-1,2],"236b1":[0,1,0,-9,8],"238a1":[1,0,0,-60,16],"238b1":[1,-1,0,2,0],"238c1":[1,-1,1,-19,35],"238d1":[1,1,1,-18,-37],"238e1":[1,1,0,32,0],"240a1":[0,-1,0,-15,-18],"240b1":[0,-1,0,24,-144],"240c1":[0,-1,0,4,0],"240d1":[0,1,0,0,-12],"242a1":[1,0,0,3,1],"242b1":[1,0,1,360,-970],"243a1":[0,0,1,0,-1],"243b1":[0,0,1,0,2],"244a1":[0,0,0,1,6],"245a1":[0,0,1,-7,12],"245b1":[0,0,1,-343,-4202],"245c1":[0,-1,1,-65,-204],"246a1":[1,1,1,-270,-1821],"246b1":[1,0,0,-175,-27847],"246c1":[1,0,1,-453897,-117739700],"246d1":[1,1,0,-66,180],"246e1":[1,0,0,-9,9],"246f1":[1,0,1,-2,2],"246g1":[1,1,0,-41,-123],"248a1":[0,1,0,0,1],"248b1":[0,1,0,8,0],"248c1":[0,0,0,1,-1],"249a1":[1,1,1,-55,134],"249b1":[1,1,0,2,1],"252a1":[0,0,0,60,61],"252b1":[0,0,0,-12,65],"254a1":[1,0,0,-22,36],"254b1":[1,0,0,2,0],"254c1":[1,-1,0,-5,-3],"254d1":[1,-1,1,-19,51],"256a1":[0,1,0,-3,1],"256b1":[0,0,0,-2,0],"256c1":[0,0,0,2,0],"256d1":[0,-1,0,-3,-1],"258a1":[1,1,0,3,-3],"258b1":[1,1,0,-1916,31440],"258c1":[1,0,1,-15,22],"258d1":[1,1,1,-24,-39],"258e1":[1,1,1,-44124,3549153],"258f1":[1,0,0,159,1737],"258g1":[1,0,0,-2,0],"259a1":[1,-1,0,-5,-32],"260a1":[0,-1,0,-281,1910],"262a1":[1,0,0,1,25],"262b1":[1,-1,0,-2,2],"264a1":[0,1,0,-8,0],"264b1":[0,-1,0,-12,-12],"264c1":[0,1,0,1,6],"264d1":[0,1,0,-8016,-278928],"265a1":[1,-1,1,-138,656],"267a1":[0,1,1,-3,2],"267b1":[0,-1,1,-441,6419],"268a1":[0,-1,0,3,-7],"269a1":[0,0,1,-2,-1],"270a1":[1,-1,0,-15,35],"270b1":[1,-1,1,7,-103],"270c1":[1,-1,1,-2,-1],"270d1":[1,-1,0,-159,813],"272a1":[0,1,0,-8,4],"272b1":[0,0,0,-11,-6],"272c1":[0,-1,0,-4,0],"272d1":[0,-1,0,-48,-64],"273a1":[0,-1,1,-26,68],"273b1":[0,1,1,2540,-157433],"274a1":[1,0,0,-7,9],"274b1":[1,-1,0,-2846,59156],"274c1":[1,-1,0,-2,0],"275a1":[1,-1,1,20,22],"275b1":[0,1,1,-8,19],"277a1":[1,0,1,0,-1],"278a1":[1,0,0,-1,9],"278b1":[1,0,1,-537,6908],"280a1":[0,-1,0,-1,5],"280b1":[0,0,0,-412,3316],"282a1":[1,1,1,58,-61],"282b1":[1,1,1,-15,21],"285a1":[1,0,0,19,0],"285b1":[1,1,0,2,-17],"285c1":[1,1,0,23,-176],"286a1":[1,0,1,-7,42],"286b1":[1,1,1,13,177],"286c1":[1,1,0,-33,61],"286d1":[1,1,1,280,393],"286e1":[1,1,1,-66,-313],"286f1":[1,1,1,0,-1],"288a1":[0,0,0,3,0],"288b1":[0,0,0,-21,-20],"288c1":[0,0,0,-21,20],"288d1":[0,0,0,-9,0],"288e1":[0,0,0,27,0],"289a1":[1,-1,1,-199,510],"290a1":[1,-1,0,-70,-204],"291a1":[0,-1,1,-2174,151262],"291b1":[1,1,1,-169,686],"291c1":[1,1,1,-3,0],"291d1":[0,-1,1,0,-1],"294a1":[1,1,1,-50,293],"294b1":[1,0,0,-1,-1],"294c1":[1,0,0,-197,-2367],"294d1":[1,0,1,23,-52],"294e1":[1,1,0,1151,18901],"294f1":[1,1,0,122,-10940],"294g1":[1,0,1,2,32],"296a1":[0,-1,0,-9,13],"296b1":[0,-1,0,-33,85],"297a1":[0,0,1,-81,290],"297b1":[1,-1,1,1,0],"297c1":[1,-1,0,12,-19],"297d1":[0,0,1,-9,-11],"298a1":[1,0,0,-19,33],"298b1":[1,-1,0,1,-1],"300a1":[0,-1,0,-13,-23],"300b1":[0,1,0,-333,-3537],"300c1":[0,1,0,-333,2088],"300d1":[0,-1,0,-13,22],"302a1":[1,1,1,-230,1251],"302b1":[1,1,0,1,5],"302c1":[1,-1,1,0,3],"303a1":[0,1,1,-197,-208],"303b1":[0,1,1,-6,2],"304a1":[0,1,0,0,-76],"304b1":[0,-1,0,-248,-1424],"304c1":[0,-1,0,-8,16],"304d1":[0,-1,0,-1,-3],"304e1":[0,-1,0,11,-3],"304f1":[0,1,0,-21,31],"306a1":[1,-1,1,-2300,-41857],"306b1":[1,-1,0,-27,-27],"306c1":[1,-1,0,-306,-1836],"306d1":[1,-1,1,-23,-21],"307a1":[0,0,1,-8,-9],"307b1":[1,1,0,0,-1],"307c1":[0,0,1,1,-1],"307d1":[0,-1,1,2,-1],"308a1":[0,-1,0,-21,49],"309a1":[1,0,0,-6,9],"310a1":[1,1,1,-66,-241],"310b1":[1,0,0,-106,420],"312a1":[0,1,0,-3,-6],"312b1":[0,-1,0,-3,0],"312c1":[0,1,0,-7,2],"312d1":[0,-1,0,-39,108],"312e1":[0,-1,0,-651,6228],"312f1":[0,1,0,5,14],"314a1":[1,-1,0,13,-11],"315a1":[0,0,1,-12,-18],"315b1":[1,-1,1,-23,-34],"316a1":[0,-1,0,-180,-872],"316b1":[0,0,0,-7,-2],"318a1":[1,1,1,2,-7],"318b1":[1,0,1,-61,176],"318c1":[1,1,0,7,-9],"318d1":[1,1,1,-12,45],"318e1":[1,1,0,142,180],"319a1":[0,0,1,-37,-87],"320a1":[0,0,0,-8,-8],"320b1":[0,0,0,-8,8],"320c1":[0,-1,0,-5,5],"320d1":[0,-1,0,0,2],"320e1":[0,1,0,0,-2],"320f1":[0,1,0,-5,-5],"322a1":[1,-1,0,-8,44],"322b1":[1,1,0,35,381],"322c1":[1,1,1,-4,1],"322d1":[1,0,0,-14,4],"323a1":[0,0,1,-46,277],"324a1":[0,0,0,-21,37],"324b1":[0,0,0,9,-18],"324c1":[0,0,0,-9,9],"324d1":[0,0,0,-39,94],"325a1":[0,1,1,-83,244],"325b1":[0,-1,1,-3,3],"325c1":[1,1,0,-25,0],"325d1":[0,1,1,-508,-4581],"325e1":[0,-1,1,-98,378],"326a1":[1,-1,0,-80,-256],"326b1":[1,0,0,-6,4],"326c1":[1,0,1,-355,1182],"327a1":[1,0,0,4,-3],"328a1":[0,0,0,-11,-10],"328b1":[0,-1,0,-12,20],"329a1":[1,1,1,246,-1376],"330a1":[1,1,0,-1393,-20603],"330b1":[1,0,0,5,17],"330c1":[1,1,1,255,255],"330d1":[1,1,1,-40266,2921559],"330e1":[1,1,0,-22,-44],"331a1":[1,0,0,-5,4],"333a1":[0,0,1,-30,-63],"333b1":[1,-1,0,12,35],"333c1":[1,-1,1,1,-2],"333d1":[0,0,1,-9,-7],"334a1":[1,-1,1,-1,-1],"335a1":[0,0,1,-2,2],"336a1":[0,-1,0,7,0],"336b1":[0,-1,0,-7,10],"336c1":[0,1,0,-7,-52],"336d1":[0,1,0,-64,-460],"336e1":[0,-1,0,16,0],"336f1":[0,1,0,-1,2],"338a1":[1,-1,0,1,1],"338b1":[1,-1,1,137,2643],"338c1":[1,0,0,81,467],"338d1":[1,1,0,504,-13112],"338e1":[1,1,1,3,-5],"338f1":[1,-1,0,-454,5812],"339a1":[0,1,1,-441,3422],"339b1":[0,-1,1,-112,501],"339c1":[0,1,1,-2,2],"340a1":[0,0,0,-28,57],"342a1":[1,-1,1,-140,-601],"342b1":[1,-1,1,-860,9915],"342c1":[1,-1,0,-72,0],"342d1":[1,-1,1,-29,1],"342e1":[1,-1,0,-3,1],"342f1":[1,-1,0,-3168,62464],"342g1":[1,-1,0,0,-32],"344a1":[0,0,0,4,4],"345a1":[0,-1,1,-731,-7369],"345b1":[0,1,1,-1,1],"345c1":[1,0,1,456,2401],"345d1":[1,0,0,9,0],"345e1":[0,-1,1,30,-97],"345f1":[0,1,1,-100,406],"346a1":[1,0,0,-16,-26],"346b1":[1,1,1,-7,-3],"347a1":[0,1,1,2,0],"348a1":[0,-1,0,2,1],"348b1":[0,1,0,-2,-3],"348c1":[0,-1,0,-94,3973],"348d1":[0,1,0,-50,129],"350a1":[1,-1,0,58,-284],"350b1":[1,0,0,112,392],"350c1":[1,1,0,5,5],"350d1":[1,1,1,-13,31],"350e1":[1,-1,0,-4492,126416],"350f1":[1,-1,1,-180,1047],"352a1":[0,1,0,-45,-133],"352b1":[0,1,0,3,11],"352c1":[0,-1,0,-45,133],"352d1":[0,-1,0,3,-11],"352e1":[0,0,0,8,-112],"352f1":[0,0,0,8,112],"353a1":[1,1,1,-2,16],"354a1":[1,1,1,-3,-3],"354b1":[1,0,1,9,-8],"354c1":[1,1,0,-715,7069],"354d1":[1,1,0,-34,-92],"354e1":[1,1,1,-23511,-1393299],"354f1":[1,1,1,-5,11],"355a1":[0,1,1,5,-1],"356a1":[0,-1,0,4,-8],"357a1":[0,-1,1,3565,72914],"357b1":[0,-1,1,-5,-16],"357c1":[0,1,1,20,-17],"357d1":[0,1,1,-42,110],"358a1":[1,1,0,55,197],"358b1":[1,0,0,-18,28],"359a1":[1,0,1,-23,39],"359b1":[1,-1,1,-7,8],"360a1":[0,0,0,-138,-623],"360b1":[0,0,0,-3,-18],"360c1":[0,0,0,-27,486],"360d1":[0,0,0,33,34],"360e1":[0,0,0,-18,-27],"361a1":[0,0,1,-38,90],"361b1":[0,-1,1,241,-17],"362a1":[1,1,0,-4,2],"362b1":[1,1,1,6,7],"363a1":[1,1,1,-789,8130],"363b1":[0,-1,1,4,-1],"363c1":[0,-1,1,444,-826],"364a1":[0,0,0,-584,5444],"364b1":[0,1,0,-5,7],"366a1":[1,0,0,-205,-1147],"366b1":[1,0,0,-5,33],"366c1":[1,0,1,-913,-10780],"366d1":[1,1,1,-7096,-233095],"366e1":[1,1,0,-1,-11],"366f1":[1,0,1,-5,20],"366g1":[1,1,1,-32,65],"368a1":[0,0,0,5,-6],"368b1":[0,0,0,-163,930],"368c1":[0,1,0,-4,-5],"368d1":[0,1,0,0,-1],"368e1":[0,-1,0,2,-1],"368f1":[0,0,0,-1,-1],"368g1":[0,0,0,-55,157],"369a1":[0,0,1,6,13],"369b1":[0,0,1,-93,-369],"370a1":[1,-1,0,-5,5],"370b1":[1,1,0,13,-19],"370c1":[1,0,1,-19,342],"370d1":[1,0,0,-75,-143],"371a1":[1,1,0,-35,-98],"371b1":[0,0,1,-31,-67],"372a1":[0,-1,0,-6,9],"372b1":[0,1,0,-9,12],"372c1":[0,1,0,-3054,-69327],"372d1":[0,1,0,-2,9],"373a1":[0,1,1,-2,-2],"374a1":[1,-1,0,-32,0],"377a1":[1,-1,0,-8,11],"378a1":[1,-1,1,10,5],"378b1":[1,-1,0,-12,24],"378c1":[1,-1,1,-2,-107],"378d1":[1,-1,0,0,4],"378e1":[1,-1,1,-11,-37],"378f1":[1,-1,0,-141,681],"378g1":[1,-1,1,3967,38449],"378h1":[1,-1,0,441,-1571],"380a1":[0,0,0,-8,-3],"380b1":[0,-1,0,-921,10346],"381a1":[0,1,1,-11,-16],"381b1":[0,1,1,-4,-5],"384a1":[0,1,0,-3,-3],"384b1":[0,-1,0,2,-2],"384c1":[0,1,0,2,2],"384d1":[0,-1,0,-3,3],"384e1":[0,1,0,-6,-18],"384f1":[0,-1,0,-6,18],"384g1":[0,-1,0,-35,-69],"384h1":[0,1,0,-35,69],"385a1":[1,-1,1,-37,124],"385b1":[1,0,0,0,7],"387a1":[0,0,1,-174,-887],"387b1":[1,-1,0,-15,-46],"387c1":[1,-1,1,-2,2],"387d1":[1,-1,1,-221,1316],"387e1":[0,0,1,-3,-9],"389a1":[0,1,1,-2,0],"390a1":[1,1,0,-13,13],"390b1":[1,1,1,15,15],"390c1":[1,0,0,-6,36],"390d1":[1,0,1,3997,3998],"390e1":[1,1,1,4,-7],"390f1":[1,1,0,-52,-176],"390g1":[1,0,1,-289,3092],"392a1":[0,0,0,49,-686],"392b1":[0,1,0,-800,-8359],"392c1":[0,-1,0,-16,29],"392d1":[0,1,0,-16,1392],"392e1":[0,0,0,-343,-2401],"392f1":[0,0,0,-7,7],"395a1":[1,-1,1,-7,14],"395b1":[1,1,1,-40,-128],"395c1":[0,-1,1,-50,156],"396a1":[0,0,0,-696,-8215],"396b1":[0,0,0,24,25],"396c1":[0,0,0,24,52],"398a1":[1,1,0,-6,20],"399a1":[1,1,0,-210,-441],"399b1":[1,1,1,-13,-22],"399c1":[1,0,0,-431,3408],"400a1":[0,0,0,-50,-125],"400b1":[0,1,0,-48,-172],"400c1":[0,-1,0,-8,112],"400d1":[0,-1,0,-3,2],"400e1":[0,1,0,-33,-62],"400f1":[0,1,0,-83,88],"400g1":[0,0,0,125,1250],"400h1":[0,0,0,5,10],"402a1":[1,1,0,-2,-12],"402b1":[1,0,1,-10,-4],"402c1":[1,1,1,-37,71],"402d1":[1,0,1,-145,692],"404a1":[0,0,0,-8,4],"404b1":[0,1,0,-69,199],"405a1":[0,0,1,-12,15],"405b1":[0,0,1,-18,29],"405c1":[1,-1,0,0,1],"405d1":[1,-1,1,-2,-26],"405e1":[0,0,1,-27,47],"405f1":[0,0,1,-3,-2],"406a1":[1,-1,0,-302,2260],"406b1":[1,0,1,-15,210],"406c1":[1,1,1,-102,355],"406d1":[1,1,0,-2124,-60592],"408a1":[0,1,0,-48,-144],"408b1":[0,1,0,-52,128],"408c1":[0,-1,0,511,-1899],"408d1":[0,1,0,-17,51],"410a1":[1,-1,0,-14,20],"410b1":[1,-1,1,-1387,-18501],"410c1":[1,0,1,-168,806],"410d1":[1,0,0,-16,0],"414a1":[1,-1,1,-320,-2221],"414b1":[1,-1,1,-14,-39],"414c1":[1,-1,0,27,-59],"414d1":[1,-1,1,-92,415],"415a1":[1,-1,0,-109,-412],"416a1":[0,1,0,0,-4],"416b1":[0,-1,0,0,4],"417a1":[1,1,0,26,73],"418a1":[1,-1,1,-4,3],"418b1":[1,1,1,66,-5],"418c1":[1,-1,1,-6,-5],"420a1":[0,-1,0,-4061,67590],"420b1":[0,-1,0,-565,5362],"420c1":[0,1,0,-61,164],"420d1":[0,1,0,-5,0],"422a1":[1,-1,0,1,-3],"423a1":[0,0,1,-12,4],"423b1":[1,-1,0,-72,355],"423c1":[1,-1,0,-18,-81],"423d1":[0,0,1,-81,-277],"423e1":[0,0,1,-111,-171],"423f1":[0,0,1,-237,1404],"423g1":[0,0,1,-9,10],"425a1":[1,-1,0,-17,16],"425b1":[1,1,0,-75,250],"425c1":[1,0,0,-3,2],"425d1":[1,0,0,-213,-1208],"426a1":[1,0,0,-20,48],"426b1":[1,1,0,-286,1780],"426c1":[1,0,1,-23007,1341682],"427a1":[0,-1,1,-1,-1],"427b1":[1,0,1,-8,7],"427c1":[1,0,0,-28,-59],"428a1":[0,1,0,-157,-812],"428b1":[0,-1,0,3,-2],"429a1":[1,1,1,2,2],"429b1":[1,0,0,-24,63],"430a1":[1,-1,0,-20,40],"430b1":[1,-1,0,16,-10],"430c1":[1,0,0,4,16],"430d1":[1,0,0,-1415,20617],"431a1":[1,0,0,0,-1],"431b1":[1,-1,1,-9,-8],"432a1":[0,0,0,0,-16],"432b1":[0,0,0,0,-4],"432c1":[0,0,0,-27,-918],"432d1":[0,0,0,-3,34],"432e1":[0,0,0,-51,-142],"432f1":[0,0,0,21,26],"432g1":[0,0,0,-108,540],"432h1":[0,0,0,-12,-20],"433a1":[1,0,0,0,1],"434a1":[1,-1,0,-7,-3],"434b1":[1,0,0,-4,16],"434c1":[1,1,1,-32,61],"434d1":[1,0,0,21,49],"434e1":[1,-1,1,-2364,-43641],"435a1":[0,1,1,-11,11],"435b1":[0,-1,1,79,-1123],"435c1":[1,0,1,-28,53],"435d1":[1,0,0,-30,-45],"437a1":[0,-1,1,19,100],"437b1":[0,-1,1,0,-5],"438a1":[1,0,0,-938,-9564],"438b1":[1,0,0,-13,-19],"438c1":[1,1,0,-5,-3],"438d1":[1,0,1,-1946,32780],"438e1":[1,0,1,-130,-556],"438f1":[1,1,1,-19,17],"438g1":[1,0,1,-8,2],"440a1":[0,0,0,-38,-87],"440b1":[0,0,0,2,-3],"440c1":[0,0,0,-5042,137801],"440d1":[0,0,0,-67,-226],"441a1":[0,0,1,0,-4202],"441b1":[0,0,1,0,12],"441c1":[1,-1,0,432,-869],"441d1":[1,-1,1,-20,46],"441e1":[0,0,1,-1029,-13806],"441f1":[0,0,1,-21,40],"442a1":[1,-1,1,-94,361],"442b1":[1,-1,1,-172,-465],"442c1":[1,1,0,-54,-172],"442d1":[1,1,1,-9,-13],"442e1":[1,1,1,-144951,7520141],"443a1":[0,1,1,1,1],"443b1":[1,0,0,-3,-2],"443c1":[1,0,1,-84,-301],"444a1":[0,-1,0,-13,-14],"444b1":[0,1,0,-9,0],"446a1":[1,1,0,-30,52],"446b1":[1,1,1,-39,-35],"446c1":[1,1,1,2,-5],"446d1":[1,-1,0,-4,4],"448a1":[0,0,0,4,16],"448b1":[0,0,0,4,-16],"448c1":[0,-1,0,-33,161],"448d1":[0,-1,0,7,-7],"448e1":[0,-1,0,-1,33],"448f1":[0,1,0,-33,-161],"448g1":[0,1,0,7,7],"448h1":[0,1,0,-1,-33],"450a1":[1,-1,1,-680,9447],"450b1":[1,-1,1,-5,47],"450c1":[1,-1,0,-27,81],"450d1":[1,-1,0,-27,-59],"450e1":[1,-1,1,145,147],"450f1":[1,-1,0,-192,1216],"450g1":[1,-1,0,333,-7259],"451a1":[0,1,1,3,7],"455a1":[1,-1,0,-50,111],"455b1":[1,-1,1,-67,226],"456a1":[0,-1,0,-16,28],"456b1":[0,1,0,-172,-928],"456c1":[0,1,0,-57,171],"456d1":[0,-1,0,55,93],"458a1":[1,-1,0,-19,37],"458b1":[1,1,1,-16,-15],"459a1":[1,-1,0,0,-1],"459b1":[0,0,1,3,-4],"459c1":[0,0,1,-6,-6],"459d1":[0,0,1,-351,2531],"459e1":[0,0,1,27,101],"459f1":[0,0,1,-54,155],"459g1":[0,0,1,-39,-94],"459h1":[1,-1,1,-2,28],"460a1":[0,0,0,-8,-12],"460b1":[0,0,0,-73,2453],"460c1":[0,1,0,-46,529],"460d1":[0,-1,0,-10,17],"462a1":[1,1,0,5,-23],"462b1":[1,1,0,-644,-2352],"462c1":[1,1,0,4,0],"462d1":[1,0,1,-1676,5058506],"462e1":[1,1,1,-405,4731],"462f1":[1,0,0,-97,1337],"462g1":[1,0,0,77,161],"464a1":[0,1,0,8,4],"464b1":[0,-1,0,-80,304],"464c1":[0,1,0,80,-428],"464d1":[0,-1,0,-4,-4],"464e1":[0,1,0,-4,-24],"464f1":[0,0,0,-4831,129242],"464g1":[0,0,0,-19,-46],"465a1":[1,1,0,-7,16],"465b1":[1,0,0,-10,-13],"466a1":[1,1,0,-5,-7],"466b1":[1,0,0,-23,41],"467a1":[0,0,1,-4,3],"468a1":[0,0,0,-168,-855],"468b1":[0,0,0,-1512,23085],"468c1":[0,0,0,-36,81],"468d1":[0,0,0,-120,-11],"468e1":[0,0,0,-48,-115],"469a1":[1,0,1,-80,-275],"469b1":[1,-1,1,-12,18],"470a1":[1,0,1,-44,106],"470b1":[1,0,1,-5773,168328],"470c1":[1,1,0,-97,281],"470d1":[1,0,0,-36,80],"470e1":[1,1,1,-11,9],"470f1":[1,-1,1,-117,141],"471a1":[1,1,1,1,2],"472a1":[0,0,0,2,1],"472b1":[0,-1,0,-276,-1676],"472c1":[0,-1,0,8,12],"472d1":[0,0,0,-19,-34],"472e1":[0,-1,0,4,4],"473a1":[0,1,1,-1006,11952],"474a1":[1,1,0,81,-27],"474b1":[1,0,1,-7,14],"475a1":[0,-1,1,17,-7],"475b1":[1,-1,0,8,291],"475c1":[1,-1,1,0,2],"477a1":[1,-1,0,3,-10],"480a1":[0,-1,0,-6,0],"480b1":[0,-1,0,-10,-8],"480c1":[0,1,0,-6,0],"480d1":[0,1,0,-226,-1360],"480e1":[0,-1,0,-226,1360],"480f1":[0,-1,0,-30,72],"480g1":[0,1,0,-10,8],"480h1":[0,1,0,-30,-72],"481a1":[1,-1,0,-1693,27240],"482a1":[1,0,1,-44,-150],"483a1":[0,1,1,-96,-457],"483b1":[0,1,1,2,1],"484a1":[0,1,0,323,2671],"485a1":[0,1,1,-121,-64],"485b1":[0,0,1,-2,0],"486a1":[1,-1,0,3,5],"486b1":[1,-1,0,-6,-4],"486c1":[1,-1,0,-123,557],"486d1":[1,-1,1,-20,-29],"486e1":[1,-1,1,-11,-11],"486f1":[1,-1,1,-29,37],"490a1":[1,0,1,121,46],"490b1":[1,1,0,17,-27],"490c1":[1,0,1,807,11708],"490d1":[1,1,0,3,1],"490e1":[1,0,0,-1,-15],"490f1":[1,-1,1,-6453,201121],"490g1":[1,0,0,-71,265],"490h1":[1,-1,1,113,711],"490i1":[1,1,1,-50,5095],"490j1":[1,1,1,-3480,-94375],"490k1":[1,-1,1,-132,-549],"492a1":[0,-1,0,-13,25],"492b1":[0,1,0,11,695],"493a1":[1,-1,1,-7741,801682],"493b1":[1,-1,1,-57,222],"494a1":[1,1,0,13,13],"494b1":[1,-1,0,4,0],"494c1":[1,-1,0,-61,-169],"494d1":[1,1,1,-1001,12375],"495a1":[1,-1,1,7,-8],"496a1":[0,0,0,1,1],"496b1":[0,-1,0,0,-1],"496c1":[0,-1,0,8,0],"496d1":[0,-1,0,-2,-1],"496e1":[0,0,0,-17,27],"496f1":[0,0,0,-11,-70],"497a1":[1,1,0,25,-14],"498a1":[1,0,1,-5,-4],"498b1":[1,0,1,-9,28]}'
);

CREMONA["5077a1"] = [0, 0, 1, -7, 6];
