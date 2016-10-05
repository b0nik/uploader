class Uploader{
    constructor(){
        this.subs={};
        this.xhr={};
        this.__subscribe=(event,fn)=>{
            if(this.subs[event]){
                this.subs[event].push(fn)
            }else {
                this.subs[event]=[];
                this.subs[event].push(fn)
            }
        };
        this.__fire=(event,obj)=>{
            if(!this.subs[event]) return false;
            this.subs[event].forEach(fn=>{
                fn(obj)
            })
        };
    }

    send(path, file, id){
        return new Promise((resolve,rejected)=>{
            const xhr = new XMLHttpRequest();
            this.xhr[id]=xhr;

            xhr.upload.onprogress = event=>{
                this.__fire(id,{id:id,loaded:event.loaded, total: event.total})
            };

            xhr.onload = xhr.onerror =(event)=> {
                if (event.target.status == 200) {
                    resolve("OK")
                } else {
                    rejected(event.target.status)
                }
                this.clear(id)
            };

            xhr.open("POST", path, true);
            xhr.send(file);
        })

    };
    clear(id){
        delete this.subs[id];
        delete this.xhr[id];
    };
    progress(id, cb){
        this.__subscribe(id, function (data) {
            cb(data)
        })

    };
    abort(id){
        if(this.xhr[id]) this.xhr[id].abort();

    }

}
