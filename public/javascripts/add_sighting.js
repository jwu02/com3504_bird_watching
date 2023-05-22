$(document).ready(function() {
    // Make a database for identification list
    const request = indexedDB.open("BirdDB", 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore("birdList", { keyPath: "id" });
        objectStore.createIndex("name", "name", { unique: false });
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(["birdList"], "readwrite");
        const objectStore = transaction.objectStore("birdList");
        const request = objectStore.get(1);

        request.onerror = function(event) {
            console.log("Unable to retrieve bird list from database!");
        };

        request.onsuccess = function(event) {
            if (request.result) {
                populateBirdList(request.result.list);
            } else {
                fetchBirdListFromDBPedia(db);
            }
        };
    };

    request.onerror = function(event) {
        console.log("Unable to access database!");
    };
});

// 2. If do not have the list, get it from DBPedia
function fetchBirdListFromDBPedia(db) {
    const endpointUrl = 'http://dbpedia.org/sparql';
    const sparqlQuery = `
        SELECT *
        WHERE {
          ?label rdfs:label "List of birds by common name"@en;
          dbo:wikiPageWikiLink ?wikiLink.
        }
    `;
    const encodedQuery = encodeURIComponent(sparqlQuery);
    const queryUrl = `${endpointUrl}?query=${encodedQuery}&format=json`;

    $.ajax({
        type: 'GET',
        url: queryUrl,
        dataType: 'json',
        success: function(response) {
            const results = response.results.bindings;
            const birdNames = results.map(result => result.wikiLink.value.split('/').pop().replace(/_/g, ' '));
            birdNames.sort();

            const transaction = db.transaction(["birdList"], "readwrite");
            const objectStore = transaction.objectStore("birdList");
            const request = objectStore.add({ id: 1, list: birdNames });

            request.onsuccess = function(event) {
                populateBirdList(birdNames);
            };

            request.onerror = function(event) {
                console.log("Unable to add bird list to database!");
            };
        }
    });
}

// 3. Make the list into selection form
function populateBirdList(birdNames) {
    birdNames.forEach(name => {
        $('#bird_name').append(`<option value='${name}'>${name}</option>`);
    });
}


// Update the identification in detail page
document.getElementById('change_id_btn').addEventListener('click', function() {
    document.getElementById('dialog').style.display = 'block';
});

document.getElementById('dialog_ok').addEventListener('click', function() {
    const selectedIdentification = document.getElementById('dialog_bird_name').value;
    document.querySelector('select[name="identification"]').value = selectedIdentification;
    document.getElementById('dialog').style.display = 'none';
});

document.getElementById('dialog_cancel').addEventListener('click', function() {
    document.getElementById('dialog').style.display = 'none';
});

