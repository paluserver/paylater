/* Ambil kode Gw! boleh aja.., asal Lu tau diri bre.
// Note: hargai pembuat kode dan tidak mengubah copyrigth.
// ©2026 - develofer By NLhost */
    /* ===== LIVE POPUP — NOMINAL KONSISTEN ===== */
    (function(){
        var container=document.getElementById('livePopupContainer');
        var INTERVAL=4500, DURATION=7000, isBusy=false;

        var namaDepan=["Andi","Budi","Citra","Dewi","Eka","Fajar","Gita","Hana","Irfan","Joko","Kartika","Lina","Maya","Nadia","Oscar","Putri","Qori","Rizky","Sari","Taufik","Umi","Vina","Wahyu","Xena","Yuni","Zahra","Aditya","Bayu","Cahya","Dimas","Elma","Firman","Gilang","Hendra","Intan","Jasmine","Kevin","Laksmi","Mira","Naufal","Olivia","Prasetyo","Ratna","Surya","Tina","Umar","Vera","Wulan","Yusuf","Zaki","Amelia","Bagus","Cinta","Dian","Erlangga","Fitri","Galih","Haris","Indra","Jihan","Kirana","Luthfi","Nurul","Okta","Purnama","Rahmat","Siti","Tono","Usman","Wendi","Yoga","Zidan"];
        var namaBelakang=["Pratama","Sari","Wijaya","Putri","Saputra","Kusuma","Lestari","Hidayat","Rahayu","Permana","Nugroho","Wibowo","Hartono","Susanto","Santoso","Kurniawan","Setiawan","Ramadhan","Prasetya","Anggraeni","Utami","Purnama","Maulana","Fitriani","Suryadi","Handoko","Sudirman","Wijayanti","Arifin","Budiman"];
        var kotaData=[{nama:"Jakarta",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Surabaya",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Bandung",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Semarang",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Medan",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Makassar",wib:"WITA",tz:"Asia/Makassar"},{nama:"Denpasar",wib:"WITA",tz:"Asia/Makassar"},{nama:"Balikpapan",wib:"WITA",tz:"Asia/Makassar"},{nama:"Manado",wib:"WITA",tz:"Asia/Makassar"},{nama:"Kupang",wib:"WITA",tz:"Asia/Makassar"},{nama:"Jayapura",wib:"WIT",tz:"Asia/Jayapura"},{nama:"Palembang",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Yogyakarta",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Malang",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Pontianak",wib:"WIB",tz:"Asia/Pontianak"},{nama:"Banjarmasin",wib:"WITA",tz:"Asia/Makassar"},{nama:"Padang",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Pekanbaru",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Batam",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Lampung",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Bogor",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Bekasi",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Tangerang",wib:"WIB",tz:"Asia/Jakarta"},{nama:"Solo",wib:"WIB",tz:"Asia/Jakarta"}];

        /* Data layanan TANPA descFn — nominal di-generate sekali di createPopup */
        var layananData=[
            {key:"cicil",label:"Aktifkan Dana Cicil",cls:"svc-cicil",svg:'<svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>'},
            {key:"paylater",label:"Aktifkan PayLater",cls:"svc-paylater",svg:'<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>'},
            {key:"nonaktif",label:"Non-Aktifkan PayLater",cls:"svc-paylater",svg:'<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'},
            {key:"refund",label:"Refund Saldo Dana",cls:"svc-refund",svg:'<svg viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>'}
        ];

        var seeds=[];for(var i=1;i<=80;i++)seeds.push("dana"+i);var usedSeeds=[];
        function randInt(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
        function randPick(a){return a[Math.floor(Math.random()*a.length)];}
        function getSeed(){var s,at=0;do{s=randPick(seeds);at++;}while(usedSeeds.indexOf(s)!==-1&&at<20);usedSeeds.push(s);if(usedSeeds.length>12)usedSeeds.shift();return s;}
        function getTimeForTZ(tz){try{return new Date().toLocaleTimeString('id-ID',{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});}catch(e){return'--:--:--';}}
        function getDateForTZ(tz){try{return new Date().toLocaleDateString('id-ID',{timeZone:tz,day:'numeric',month:'short',year:'numeric'});}catch(e){return'';}}
        function getStatus(){var r=Math.random()*100;if(r<75)return'sukses';if(r<90)return'proses';return'gagal';}

        /* Helper: format ribuan → "1.500.000" */
        function formatRupiahFull(n){
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");
        }

        var vSvg='<svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>';
        var sSvg='<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
        var gSvg='<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
        var pSvg='<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
        var clockSvg='<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 10 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>';

        var aCtx=null;
        function playSound(){try{if(!aCtx)aCtx=new(window.AudioContext||window.webkitAudioContext)();var o=aCtx.createOscillator(),g=aCtx.createGain();o.connect(g);g.connect(aCtx.destination);o.type='sine';o.frequency.setValueAtTime(880,aCtx.currentTime);o.frequency.exponentialRampToValueAtTime(1100,aCtx.currentTime+0.08);g.gain.setValueAtTime(0.06,aCtx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,aCtx.currentTime+0.2);o.start(aCtx.currentTime);o.stop(aCtx.currentTime+0.2);}catch(e){}}

        function createPopup(){
            var nama=randPick(namaDepan)+' '+randPick(namaBelakang);
            var kota=randPick(kotaData);
            var svc=randPick(layananData);
            var status=getStatus();
            var seed=getSeed();
            var waktu=getTimeForTZ(kota.tz);
            var tanggal=getDateForTZ(kota.tz);
            var verified=Math.random()<0.3;

            /* ===== NOMINAL DI-GENERATE SEKALI SAJA ===== */
            var desc='', amtText='';

            if(svc.key === 'cicil'){
                var limitJuta = randInt(1, 10);
                desc = 'Pengajuan Cicil — Limit Rp' + limitJuta + ' Juta';
                amtText = '<span class="lpc-amount negatif">Rp' + limitJuta + ' Jt</span>';
            }
            else if(svc.key === 'paylater'){
                var limitJuta = randInt(10, 20);
                desc = 'Aktivasi PayLater — Limit s/d Rp' + limitJuta + ' Juta';
                amtText = '<span class="lpc-amount negatif">Rp' + limitJuta + ' Jt</span>';
            }
            else if(svc.key === 'refund'){
                var refundRibu = randInt(100, 500);
                var refundTotal = refundRibu * 1000;
                desc = 'Refund Rp' + formatRupiahFull(refundTotal) + ' — Proses 1x24 jam';
                amtText = '<span class="lpc-amount positif">+Rp' + refundRibu + 'K</span>';
            }
            else {
                desc = 'Penonaktifan PayLater berhasil diproses';
                amtText = '<span class="lpc-amount neutral">Diproses</span>';
            }

            var sLabel=status==='sukses'?'Berhasil':(status==='proses'?'Proses':'Gagal');
            var dotCls='dot-'+status;
            var dotSvg=status==='sukses'?sSvg:(status==='proses'?pSvg:gSvg);
            var psbCls='psb-'+status;
            var fillCls='fill-'+status;

            var card=document.createElement('div');
            card.className='live-popup-card';
            card.style.setProperty('--dur',DURATION+'ms');
            card.innerHTML=
                '<div class="lpc-body">'+
                    '<div class="lpc-avatar-wrap">'+
                        '<img class="lpc-avatar" src="assets/avatars/'+seed+'.jpg" alt="">'+
                        '<div class="lpc-status-dot '+dotCls+'">'+dotSvg+'</div>'+
                    '</div>'+
                    '<div class="lpc-info">'+
                        '<div class="lpc-user-row">'+
                            '<span class="lpc-username">'+nama+'</span>'+
                            (verified?'<span class="lpc-verified">'+vSvg+'</span>':'')+
                        '</div>'+
                        '<div class="lpc-detail-row">'+
                            '<span class="lpc-svc-badge '+svc.cls+'">'+svc.svg+' '+svc.label+'</span>'+
                            amtText+
                        '</div>'+
                        '<div class="lpc-desc">'+desc+'</div>'+
                    '</div>'+
                '</div>'+
                '<div class="lpc-meta">'+
                    '<span class="lpc-status-badge '+psbCls+'">'+sLabel+'</span>'+
                    '<span class="lpc-location">'+pSvg+' '+kota.nama+' ('+kota.wib+')</span>'+
                '</div>'+
                '<div class="lpc-datetime">'+
                    '<span class="lpc-time">'+clockSvg+' '+waktu+'</span>'+
                    '<span class="lpc-date">'+tanggal+'</span>'+
                '</div>'+
                '<div class="lpc-progress"><div class="lpc-progress-fill '+fillCls+'"></div></div>';

            if(status==='proses'){
                (function(el){
                    setTimeout(function(){
                        if(!el.parentNode)return;
                        var ns=Math.random()<0.85?'sukses':'gagal';
                        var d=el.querySelector('.lpc-status-dot');
                        if(d){d.className='lpc-status-dot dot-'+ns;d.innerHTML=ns==='sukses'?sSvg:gSvg;}
                        var b=el.querySelector('.lpc-status-badge');
                        if(b){b.className='lpc-status-badge psb-'+ns;b.textContent=ns==='sukses'?'Berhasil':'Gagal';}
                        var f=el.querySelector('.lpc-progress-fill');
                        if(f)f.className='lpc-progress-fill fill-'+ns;
                    },randInt(2000,4000));
                })(card);
            }

            return card;
        }

        function showPopup(){
            if(isBusy)return;
            isBusy=true;
            var card=createPopup();
            container.prepend(card);
            playSound();
            var timer=setTimeout(function(){dismissPopup(card);},DURATION);
            card._timer=timer;
            card.addEventListener('click',function(){clearTimeout(card._timer);dismissPopup(card);});
            setTimeout(function(){isBusy=false;},Math.min(DURATION-1500,INTERVAL));
        }

        function dismissPopup(card){
            if(!card||card.classList.contains('popup-exit'))return;
            clearTimeout(card._timer);
            card.classList.add('popup-exit');
            setTimeout(function(){if(card.parentNode)card.parentNode.removeChild(card);},350);
        }

        setTimeout(function(){
            showPopup();
            setInterval(function(){showPopup();},INTERVAL);
        },2000);
    })();
