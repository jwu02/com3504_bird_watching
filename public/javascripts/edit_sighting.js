let identificationSpan = document.getElementById("identification-span")
let currentIdentificationLabel = identificationSpan.innerText;

let editIdentificationBtn = document.getElementById("edit-identification-btn");
let editIdentificationHiddenSpan = document.getElementById("edit-identification-hidden");
let identificationInput = `<select id="bird_name" name="identification">
                                <option selected>Unknown</option>
                                <option>Uncertain</option>
                            </select>`;

editIdentificationBtn.addEventListener("click", ()=>{
    editIdentificationBtn.hidden = true;
    editIdentificationHiddenSpan.hidden = false;
    identificationSpan.innerHTML = identificationInput;
});

let editIdentificationCancelBtn = document.getElementById("edit-identification-cancel-btn");
editIdentificationCancelBtn.addEventListener("click", ()=>{
    editIdentificationBtn.hidden = false;
    editIdentificationHiddenSpan.hidden = true;
    identificationSpan.innerHTML = currentIdentificationLabel;
});



