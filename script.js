const dataUrl = "https://mock-api-pribadi-malik.vercel.app/api/mosleme-travel/packages";

function renderCards(cardsData) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.textContent = '';
    cardsData.forEach(paket => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.classList.add('card-img');
        img.src = paket.image_thumbnail;

        const title = document.createElement('h2');
        title.classList.add('card-title');
        title.textContent = paket.judul_paket;

        const kuotaTersedia = document.createElement('p');
        kuotaTersedia.classList.add('kuota-tersedia');
        kuotaTersedia.textContent = paket.kuota_tersedia + " Kuota tersedia";

        const jadwalKeberangkatan = document.createElement('p');
        jadwalKeberangkatan.classList.add('jadwal-keberangkatan');
        const tanggalKeberangkatan = new Date(paket.jadwal_keberangkatan);
        const tanggal = tanggalKeberangkatan.getDate();
        const bulan = tanggalKeberangkatan.toLocaleString('default', { month: 'long' });
        const tahun = tanggalKeberangkatan.getFullYear();
        jadwalKeberangkatan.textContent = `${tanggal} ${bulan} ${tahun}`;

        const maskapaiName = document.createElement('p');
        maskapaiName.classList.add('maskapai-name');
        maskapaiName.textContent = paket.maskapaiName;

        const hotelStar = document.createElement('p');
        hotelStar.classList.add('hotel-star');
        hotelStar.textContent = "⭐️".repeat(paket.hotel_star);

        const jumlahHari = document.createElement('p');
        jumlahHari.classList.add('jumlah-hari');
        jumlahHari.textContent = paket.jumlah_hari + " Hari";

        const mendarat = document.createElement('p');
        mendarat.classList.add('mendarat');
        mendarat.textContent = paket.mendarat_di;

        const harga = document.createElement('p');
        harga.classList.add('harga');
        const hargaBulat = Math.ceil(paket.price_quad_basic);
        const hargaRupiah = hargaBulat.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
        harga.textContent = hargaRupiah + "/pax";

        const button = document.createElement('button');
        button.classList.add('button');
        button.textContent = 'Pilih Paket';
        button.addEventListener('click', () => {
            alert('Paket terpilih: ' + paket.judul_paket);
        });
        
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(kuotaTersedia);
        card.appendChild(jadwalKeberangkatan);
        card.appendChild(maskapaiName);
        card.appendChild(hotelStar);
        card.appendChild(jumlahHari);
        card.appendChild(mendarat);
        card.appendChild(harga)
        card.appendChild(button)

        cardContainer.appendChild(card);
    });
}

function getDataFilter() {
    fetch(dataUrl)
    .then(response => response.json())
    .then(item => {

        renderCards(item.cards);
        
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        const filterPriceButton = document.getElementById('filterPriceButton');
        
        filterPriceButton.addEventListener('click', () => {
            const minPrice = parseInt(minPriceInput.value);
            const maxPrice = parseInt(maxPriceInput.value);
            const filteredPrice = item.cards.filter(paket => {
                const harga = Math.ceil(paket.price_quad_basic);
                return harga >= minPrice && harga <= maxPrice;
            });
            renderCards(filteredPrice);
        });

        const hajiCheckbox = document.getElementById('hajiCheckbox');
        const umrahCheckbox = document.getElementById('umrahCheckbox');
        const tourCheckbox = document.getElementById('tourCheckbox');

        function filterCards() {
            const haji = hajiCheckbox.checked;
            const umrah = umrahCheckbox.checked;
            const tour = tourCheckbox.checked;

            const allMonth = document.getElementById('allMonth');
            allMonth.textContent = '';

            if (!haji && !umrah && !tour) {
                renderCards(item.cards);
                return;
            }
            
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const title = card.querySelector('h2').textContent;
                if ((haji && title.includes("Haji")) ||
                (umrah && title.includes("Umrah")) ||
                (tour && title.includes("Tour"))) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            
            function getAllMonths() {
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                return months;
            }
            
            const bulan = getAllMonths()
            bulan.forEach(bulan => {
                if (!haji && !umrah && !tour) {
                    allMonth.textContent = "";
                } else {
                    const allMonth = document.getElementById('allMonth')
                    allMonth.className = 'monthContainer';
                    const pilihBulan = document.createElement('label');
                    pilihBulan.className = 'pilihBulan';
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.value = bulan;
                    pilihBulan.appendChild(input);
                    pilihBulan.appendChild(document.createTextNode(bulan));
                    allMonth.appendChild(pilihBulan)
                }
            })
            function filterCardsBulan() {
                const selectedMonths = Array.from(document.querySelectorAll('#allMonth input:checked')).map(input => input.value);
                const haji = document.getElementById('hajiCheckbox').checked;
                const umrah = document.getElementById('umrahCheckbox').checked;
                const tour = document.getElementById('tourCheckbox').checked;
                
                const cards = document.querySelectorAll('.card');
                const main = document.getElementById('main')

                let paketDitemukan = false; 
                
                cards.forEach(card => {
                    const jadwalKeberangkatanText = card.querySelector('p:nth-of-type(2)').textContent;
                    const bulanKeberangkatan = jadwalKeberangkatanText.split(' ')[1];
                    const title = card.querySelector('h2').textContent;
                    
                    if ((selectedMonths.includes(bulanKeberangkatan)) &&
                    ((haji && title.includes("Haji")) ||
                    (umrah && title.includes("Umrah")) ||
                    (tour && title.includes("Tour")))) {
                        card.style.display = '';
                        paketDitemukan = true;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                if (!paketDitemukan) {
                    const paketTidakDitemukan = document.createElement('div');
                    paketTidakDitemukan.textContent = 'Paket Tidak Tersedia';
                    paketTidakDitemukan.classList.add('paketTidakDitemukan');
                    main.appendChild(paketTidakDitemukan);
                } else {
                    const paketTidakDitemukan = document.querySelector('paketTidakDitemukan');
                    if (paketTidakDitemukan) {
                        paketTidakDitemukan.remove();
                    }
                }

                if (selectedMonths.length === 0 ) {
                    renderCards(item.cards);
                }
            }
            
            document.querySelectorAll('#allMonth input').forEach(input => {
                input.addEventListener('change', filterCardsBulan);
            });
        }

        hajiCheckbox.addEventListener('change', filterCards, );
        umrahCheckbox.addEventListener('change', filterCards);
        tourCheckbox.addEventListener('change', filterCards);
    })

}

getDataFilter();

