function fnv1a32(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function av(h){let x=h>>>0;x^=x>>>16;x=Math.imul(x,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return x>>>0;}
const k='w-2917::DS-DEF-11::WALLED-STRAINED';
const h=av(fnv1a32(k));
console.log('key',k,'hash',h,'%2',h%2,'%3',h%3);
const hw=av(fnv1a32(k+'::w'));
console.log('faceKey hash',hw,'%4',hw%4);
