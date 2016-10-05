const fileUploader=new Uploader();
fileUploader.showList=function () {
    const chosen= document.createElement('div');
    chosen.className="list";
    const ul=document.createElement('ul');
    chosen.appendChild(ul);
    document.body.appendChild(chosen);

    return files=> {
        let newUl=document.createElement('ul');
        files.forEach(item=>{
            const id=item.get("name");

            let li = document.createElement('li');
            li.className='list__item';

            let textSpan=document.createElement('span');
            textSpan.textContent=id;
            textSpan.className='list__item__text';


            let progress=document.createElement('span');
            progress.className='list__item__progress';

            let progressLine=document.createElement('span');
            progressLine.className='list__item__progress__line';

            let abortButton=document.createElement('button');
            abortButton.textContent='cancel';

            abortButton.addEventListener('click', ()=> {
                this.abort(id);
            });

            this.progress(id, function (data) {
                progressLine.style.width=((data.loaded/data.total)*100).toFixed()+"%"
            });
            progress.appendChild(progressLine);
            li.appendChild(textSpan);
            li.appendChild(progress);
            li.appendChild(abortButton);
            newUl.appendChild(li);
        });

        chosen.replaceChild(newUl, chosen.querySelector('ul'))

    }
};

(function () {

    const form = document.getElementById('js-upload_form')['data'];
    const button = document.getElementById('js-upload_form')[1];
    button.disabled=true;
    let files=[];
    const popup=fileUploader.showList();

    form.addEventListener('change', e=> {
        files=[];
        const obj = e.target.files;
        button.disabled=false;

        if(e.target.value===''){
             button.disabled=true;
        }else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let file = new FormData();
                    file.append('file', obj[key]);
                    file.append('name', obj[key].name);
                    files.push(file);

                }
            }
        }
        popup(files);
    });

    function upload(path) {
        files.forEach((file)=>{
            fileUploader.send(path, file, file.get("name"));
        })
    }

    document.getElementById('js-upload_form').addEventListener('submit', function (e) {
        button.disabled=true;
        e.stopPropagation();
        e.preventDefault();
        upload('/upload')
    });

})();