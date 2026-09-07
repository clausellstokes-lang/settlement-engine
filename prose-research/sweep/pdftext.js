ObjC.import('Quartz');
function run(argv){ var p=argv[0]; var d=$.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(p)); if(d.isNil()){return 'NIL';} return d.string.js; }
