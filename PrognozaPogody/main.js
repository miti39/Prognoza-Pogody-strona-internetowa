
    function pobierzPogode(){
        const info = document.querySelector("main .info");
        const temp = document.querySelector("main .temp");
        const icon = document.querySelector("main .ikona");

        function showError(message) {
            temp.innerText = "";
            icon.src = "";
            info.innerHTML = `<p class="error">${message}</p>`;
        }

        if (!city || city.trim() === "") {
            showError("Wpisz nazwę miasta");
        } else {

            info.innerText = "Pogoda w " + city;

            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`)
                .then(response => {

                    if (!response.ok) {
                        throw new Error("Błąd serwera: " + response.status);
                    }

                    return response.json();
                })
                .then(data => {

                    if (data.cod === 404) {
                        showError("Nie znaleziono takiego miasta");
                        return;
                    }

                    if (!data.main || !data.weather) {
                        showError("Niepoprawne dane z API");
                        return;
                    }

                    console.log(data);

                    temp.innerText = "Aktualna temperatura to " + Math.round(data.main.temp) + "°C";

                    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
                    icon.alt = data.weather[0].description;

                })
                .catch(error => {

                    console.error(error);

                    if (error.message.includes("Failed to fetch")) {
                        showError("Brak połączenia z internetem");
                    } else {
                        showError("Wystąpił błąd podczas pobierania pogody");
                    }

                });

    }

        //Pobranie Pogody na 4 następne dni

        let tab = document.querySelector(`main .tab`);
        let text = "";

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`)
        .then(res => res.json())
            .then(data => {

            const daily = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            );

            //pierwszy wiersz
            text +=  `<tr>`;
                
            for(let i = 1; i < 5; i++){
            
                let date = new Date(daily[i].dt_txt);

                let plData = date.toLocaleDateString('pl-PL');

                text += `<th> ${plData} </th>`;

            }

            text +=  `</tr>`;

            //drugi wiersz
            text +=  `<tr>`;
                
            for(let i = 1; i < 5; i++){
            text += 
            `<th> ${Math.round(daily[i].main.temp)}°C </th>`;
            }

            text +=  `</tr>`;

            //trzeci wiersz
            text +=  `<tr>`;
                
            for(let i = 1; i < 5; i++){
            text += 
            `<th> ${daily[i].weather[0].description} </th>`;
            }

            text +=  `</tr>`;
            
            tab.innerHTML = text;     
        });

    }

    // function noweMiasto(){
        
    //     let main = document.getElementById("main");

    //     let dane = main;


    //     let div = document.createElement("div");
    //     liczbaDiv++;
    //     div.classList.add("div" + liczbaDiv);

    //     if(city.trim() === ""){
            
    //         div.innerHTML = `<p>Nie podałeś miasta</p> <hr class="linia">`;
    //         main.insertBefore(div, main.firstChild);

    //     }else{

    //         div.innerHTML = 
    //             `
    //             <p class="info"></p>
                
    //             <div class="imgTlo">
    //                 <img src="" class="ikona">
    //             </div>
                
    //             <p class="temp"></p>
                
    //             <hr>

    //             <p>Pogoda na najbliższe 4 dni:</p>
    //             <table class="tab">
    //             </table>
    //             <hr class="linia">
    //         `;
            
            
    //         main.insertBefore(div, main.firstChild);

    //         pobierzPogode();

    //     }
    // }

    pobierzPogode();

    let przycisk = document.getElementById("guzik");

    przycisk.addEventListener("click", function() {
        city = document.getElementById("noweMiasto").value;

        //noweMiasto();
        pobierzPogode();
    });

    let zmianaTrybu = document.getElementById("trybNoc");

    zmianaTrybu.addEventListener("click", function() {

        let body = document.querySelector("body");

        if(!body.classList.contains('noc')){
            body.classList.add('noc');
            document.querySelector(".obraz").src="obrazy/night.jpg";
        }else{
            body.classList.remove("noc");
            document.querySelector(".obraz").src="obrazy/sky.jpg";
        }

    });

