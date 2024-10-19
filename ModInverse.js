
let p = 3, q = 11;
let e=7;
let d;

for(let i = 1 ; i< 1000; i++){
    if((e * i) % 20 == 1){
        d = i;
        break;
    }
}

console.log(d);