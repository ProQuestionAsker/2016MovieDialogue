# This repository contains all of the word-count data that I used to analyze gender equality in 2016's Highest Grossing Films. 

A .csv file exists for each film.  Each file has the following columns:
* Character: Character's Name
* speaking_turns: The number of independent times a character spoke. This was calculated based on the number of individual times a character's name appeared in the transcript
* Total_Words: Sum of the words spoken by a character during the duration of the entire film
* Gender: Gender of each character (details for determining character's gender available [here](https://proquestionasker.github.io/projects/MovieDialogue/#assigning-gender-to-characters)
* Radius: Necessary radius of a circle, scaled by area, based on the Total_Words spoken by a character
* Diameter: Diameter of a circle, scaled by area, based on the Total_Words spoken by a character (this was used in Adobe Illustrator)

Index.html, Styles.CSS, and movie_bubbles2.js were all used to generate the interactive visualization available [here](https://proquestionasker.github.io/projects/MovieDialogueInteractive/)

In depth description of this project is available [here](https://proquestionasker.github.io/projects/MovieDialogue/#assigning-gender-to-characters)
