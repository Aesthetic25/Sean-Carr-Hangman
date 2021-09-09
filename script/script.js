//declare the variables.
const categoryText = document.querySelector("#chosen-category"),
    mysteryWordText = document.querySelector("#mystery-word"),
    livesText = document.querySelector("#lives"),
    playButton = document.querySelector("#play-button"),
    restartButton = document.querySelector("#restart-button"),
    alphabetButtons = document.querySelectorAll(".button")
;
let countriesList = [],
    animalsList = [],
    namesList = []
;
//function to import the json files needed.
function importJSON(file, arrayToAppendTo){
    $.getJSON(file, (jsonData)=>{
        for(let i = 0; i<jsonData.length; i++){
            arrayToAppendTo.push(jsonData[i]);
        };
        return arrayToAppendTo;
    });
};
//calls the function to push the json data to an array declared earlier.
importJSON("/script/countries.json", countriesList);
importJSON("/script/animals.json", animalsList);
importJSON("/script/names.json", namesList);

class Hangman{
    constructor(categoryText, mysteryWordText, livesText, playButton, restartButton, alphabetButtons,countries, animals, names){
        this.lives = 10;
        this.categoryText = categoryText;
        this.mysteryWordText = mysteryWordText;
        this.livesText = livesText;
        this.playButton = playButton;
        this.restartButton = restartButton;
        this.alphabetButtons = alphabetButtons;
        this.countriesList = countries;
        this.animalsList = animals;
        this.namesList = names;
        this.clear();
    };
    clear(){
        this.mysteryWordText.innerHTML = "_ _ _ _";
        this.lives = 10;
        this.livesText.innerHTML = `You have ${this.lives} lives left.`;
        this.resetButtonColor();
        this.status = "disabled";
    };
    restart(){
        this.mysteryWordText.innerHTML = "_ _ _ _"
        this.lives = 10;
        this.livesText.innerHTML = `You have ${this.lives} lives left.`;
        this.resetButtonColor();
        this.status = "disabled";
    };
    resetButtonColor(){
        this.alphabetButtons.forEach((button)=>{
            button.style.backgroundColor = "#187bcd";
            button.style.color = "#fff";
        })
    };
    changeButtonColor(button){
        if(button.style.backgroundColor == "rgb(255, 255, 255)") return true;
        button.style.backgroundColor = "#fff";
        button.style.color = "#187bcd";
    };
    play(){
        this.restart();
        this.status = "enabled"
        let categories = ["countries", "animals", "names"];
        let randomArrayElement = (array)=>{
            let randomPickedNumber = Math.floor(Math.random() * array.length);
            return array[randomPickedNumber];
        };
        let chosenCategory = randomArrayElement(categories);
        let underscorePrinter = (array)=>{
            let finalUnderscoreString = [];
            array.forEach((arrayVal)=> (arrayVal === "-") ? (finalUnderscoreString.push("- ")) : (finalUnderscoreString.push("_ ")));
            return finalUnderscoreString;
        };
        switch(chosenCategory){
            case "countries":
                this.chosenWord = randomArrayElement(this.countriesList).replace(/\s/g, "-").split("");
                this.categoryText.innerHTML = "The Chosen Category is Countries.";
                this.mysteryWordText.innerHTML = underscorePrinter(this.chosenWord).join("");
                console.log(this.chosenWord.join(""));//
                break;
            case "animals":
                this.chosenWord = randomArrayElement(this.animalsList).split("");
                this.categoryText.innerHTML = "The Chosen Category is Animals.";
                this.mysteryWordText.innerHTML = underscorePrinter(this.chosenWord).join("");;
                console.log(this.chosenWord.join(""));//
                break;
            case "names":
                this.chosenWord = randomArrayElement(this.namesList).split("");
                this.categoryText.innerHTML = "The Chosen Category is Names.";
                this.mysteryWordText.innerHTML = underscorePrinter(this.chosenWord).join("");;
                console.log(this.chosenWord.join(""));//
                break;
            default:
                return;
        };
    };
    alphabetButtonActivated(buttonLetter, buttonElement){
        if(this.status == "disabled"){
            this.clear();
            return true;
        };
        if(buttonElement.style.backgroundColor == "#fff") return;
        let temporaryTextPlaceholder = this.mysteryWordText.innerHTML.replace(/\s/g, "").split("");
        if(this.chosenWord.includes(buttonLetter) || this.chosenWord.includes(buttonLetter.toLowerCase())){
            this.chosenWord.forEach((arrayVal, arrayIndex) =>{
                if(buttonLetter == arrayVal) temporaryTextPlaceholder[arrayIndex] = arrayVal;
                if(buttonLetter.toLowerCase() == arrayVal) temporaryTextPlaceholder[arrayIndex] = arrayVal;
            });
        this.mysteryWordText.innerHTML = temporaryTextPlaceholder.join(" ")
        }else{
            this.checkButtonColor;
            console.log("wrong letter")//
            this.lives--;
            (this.lives == 1) ? (this.livesText.innerHTML = `You have ${this.lives} life left.`) : (this.livesText.innerHTML = `You have ${this.lives} lives left.`);
        };
        if(this.lives == 0){
            setTimeout(() => {alert(`Game over, the word was "${this.chosenWord.join("")}"`)}, 100);
            this.status = "disabled"
            this.clear();
            return;
        };
        if(this.mysteryWordText.innerHTML.includes("_" || " _" || "_ ")) return;
        console.log(this.chosenWord.join(""))//
        setTimeout(() => alert(`You win, the word was "${this.chosenWord.join("")}"`), 100);
        this.status = "disabled";
        this.clear();
        return;
    };
};
//creates new instance of the class "Hangman"
const hangman = new Hangman(categoryText, mysteryWordText, livesText, playButton, restartButton, alphabetButtons, countriesList, animalsList, namesList);
//adding event listeners to the buttons.
playButton.addEventListener("click", ()=> hangman.play());
restartButton.addEventListener("click", ()=> hangman.clear());
alphabetButtons.forEach(button => {
        button.addEventListener('click', ()=>{
            if(hangman.changeButtonColor(button)==true) return;
            hangman.changeButtonColor(button);
            hangman.alphabetButtonActivated(button.innerHTML, button);
        });
    }
);