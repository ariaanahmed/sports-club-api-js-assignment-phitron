const loadPlayers = (searchText, limit) => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchText}`
    fetch(url).then((res) => res.json())
        .then((data) => {
            displayPlayers(data.player, limit)
        }).catch((error) => {
            console.error('Error fetching data:', error);
            document.getElementById("card-container").innerHTML = "<p>Error loading players.</p>";
        });
}

// display players
const displayPlayers = (players, limit) => {
    const itemContainer = document.getElementById("card-container");
    itemContainer.innerText = "";

    if (!players || players.length === 0) {
        itemContainer.innerHTML = "<p>No players found.</p>";
        return;
    }

    let limitPlayers;
    if (limit) {
        limitPlayers = players.slice(0, 9);
    } else {
        limitPlayers = players;
    }


    limitPlayers.forEach(player => {

        // if (!player?.strThumb) {
        //     return;
        // }
        
        const cardDiv = document.createElement("div")
        cardDiv.classList.add("card")
        const description = player.strDescriptionEN ? player.strDescriptionEN.slice(0, 11) : "Not available";
        
        const image = player.strThumb ? player.strThumb : "./Images/user.jpg";

        const instagramLink = player.strInstagram ? `<a href="https://${player.strInstagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>` : '<i class="fa-solid fa-ban"></i>';

        const facebookLink = player.strFacebook ? `<a href="https://${player.strFacebook}" target="_blank"><i class="fa-brands fa-facebook"></i></a>` : '<i class="fa-solid fa-ban"></i> ';

        cardDiv.innerHTML = `
        <img src="${image}" class="card-img-top img-fluid" alt="card-img">
        <div class="card-body">
            <h6>Name : ${player.strPlayer}</h6>
            <p>Country : ${player.strNationality}</p>
            <p>Team : ${player.strTeam}</p>
            <p>Sport : ${player.strSport}</p>
            <p>Description : ${description}</p>
            <p>Gender : ${player.strGender}</p>
            <p>Social Media : 
                ${facebookLink}
                ${instagramLink}
            </p>

            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#playerDetails" onclick="showDetails(${player.idPlayer})">Details</button>
            <button type="button" class="btn btn-warning" onclick="handleAddToCart('${player.strPlayer}', this)">Add</button>
        </div>
        `
        itemContainer.appendChild(cardDiv)
    });
}

// search display
const displaySearch = document.getElementById("search-btn");
displaySearch.addEventListener("click", () => {
    const inputField = document.getElementById("search-field").value;
    const errorMessage = document.getElementById("errorMessage");

    if (inputField === "") {
        errorMessage.innerText = "Empty Field"
    } else {
        errorMessage.innerText = ""
        loadPlayers(inputField, false)
        document.getElementById("search-field").value = ""
    }
})


// show details
const showDetails = (playerId) => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`;
    fetch(url).then((res) => res.json()).then((data) => {
        showPlayersDetails(data.players)
    }).catch((error) => {
        console.log("Error fetching data: ", error);
        document.getElementById("card-container").innerHTML = "<p>Error loading players.</p>";
    })
}

// modal showing
const showPlayersDetails = (details) => {
    details.forEach(detail => {
        const status = detail.strStatus ? detail.strStatus : "Unavailable"
        const description = detail.strDescriptionEN ? detail.strDescriptionEN.slice(0, 160) : "Not available";
        console.log(detail)
        document.getElementById("playerDetailsLabel").innerText = detail.strPlayer;
        const playerDetailContainer = document.getElementById("playerDetaiBody");
        playerDetailContainer.innerHTML = `
            <img src="${detail.strThumb}" class="img-fluid" alt="card-img">
            <p>Gender : ${detail.strGender}</p>
            <p>Sport : ${detail.strSport}</p>
            <p>Team : ${detail.strTeam}</p>
            <p>Country : ${detail.strNationality}</p>
            <p>Status : ${status}</p>
            <p>Desc : ${description}</p>
        `
    });
}

// handle add to cart

const handleAddToCart = (name, button) => {
    const cartCount = document.getElementById("totalCount").innerText;
    let convertedCartCount = parseInt(cartCount);

    if (convertedCartCount >= 11) {
        alert("Already Full");
        return;
    }

    convertedCartCount = convertedCartCount + 1;
    document.getElementById("totalCount").innerText = convertedCartCount;

    const cartContainer = document.getElementById("card-body")
    const cartBody = document.createElement("card-body")
    cartBody.classList.add("card-body")

    cartBody.innerHTML = ` 
        <li class="list-group-item">${name}</li>
    `
    cartBody.innerHTML = name;
    cartContainer.appendChild(cartBody);

    button.innerText = "Added";
    button.disabled = true;
}



loadPlayers('g', true)