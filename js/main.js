
document.querySelectorAll('.input-div').forEach(el => {
    el.addEventListener('click', getMealsByCategory)
});
document.querySelectorAll('.food-thumbnail').forEach(el => { 
    el.addEventListener('click', getRecipeOfMeal)
});

async function getMealsByCategory(){
    document.querySelector('.list-of-food').classList.remove('display-none')
    document.querySelector('#jhjh').classList.add('display-none')

    const foodCategory = document.querySelector('input[name=food-category]:checked').value;
    try{
        const res = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?c=${foodCategory}`);
        const data = await res.json()

        data.meals.splice(8);
        data.meals.forEach((x, i) => {
            const idOfMeal = x.idMeal
            const imageOfMeal = x.strMealThumb
            const nameOfMeal = x.strMeal
            document.querySelector(`#food-thumbnail-${i+1}`).setAttribute('data-meal-id', idOfMeal)
            document.querySelector(`#food-img-${i+1}`).src = imageOfMeal
            document.querySelector(`#food-name-${i+1}`).innerHTML = nameOfMeal.toUpperCase()
        })
    }catch(err){
        console.log(err)
    }
}

async function getRecipeOfMeal(event) {
    document.querySelector('.list-of-food').classList.add('display-none')
    document.querySelector('#jhjh').classList.remove('display-none')

    const foodId = event.currentTarget.getAttribute("data-meal-id");
    try { 
        const res = await fetch(`https://themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`);
        const data = await res.json()

        const imageOfMeal = data.meals[0].strMealThumb 
        const mealInstruction = data.meals[0].strInstructions
        console.log(data.meals[0])
        const nameOfMeal = data.meals[0].strMeal
        const youTube = data.meals[0].strYoutube
        const youTubeFixed = youTube.replace("watch?v=", "embed/")
        const instructionWithBreak = mealInstruction.replaceAll('\r\n', '<br />')

        const ingredients = Object.keys(data.meals[0])
            .filter(key => key.startsWith('strIngredient')) // Filter keys that start with "strIngredient"
            .reduce((obj, key) => {
                if (data.meals[0][key] && data.meals[0][key] != " ") {
                    obj[key] = data.meals[0][key]; // Add the key-value pair to the new object
                }
                return obj;
        }, {});
        const measures =  Object.keys(data.meals[0])
            .filter(key => key.startsWith('strMeasure')) 
            .reduce((obj, key) => {
                if (data.meals[0][key] && data.meals[0][key] != " ") {
                    obj[key] = data.meals[0][key]; 
                }
                return obj;
        }, {});
        console.log(measures)
        console.log(ingredients)

        const ingredientsList = document.querySelector(".ingredients");
        //const measuresList = document.querySelector(".measure");
        ingredientsList.innerHTML = ""; // Clear the list of ingredients
        //measuresList.innerHTML = ""; // Clear the list of measures

        document.querySelector('#name-of-meal').innerHTML = nameOfMeal
        document.querySelector('#photo-of-meal').src = imageOfMeal
        document.querySelector('#instruction').innerHTML = instructionWithBreak
        document.querySelector('.you-tube').src = youTubeFixed


        if(youTubeFixed){
            document.querySelector('.you-tube').classList.remove('display-none')
            document.querySelector('.you-tube').src = youTubeFixed
        } else {
            document.querySelector('.you-tube').classList.add('display-none')
        }
        
        Object.keys(measures).forEach((key, index) => {
            const newLi = document.createElement("li");
            const ingredientSpan = document.createElement("span");
            const measureSpan = document.createElement("span");

            ingredientSpan.textContent = ingredients[`strIngredient${index+1}`];
            measureSpan.textContent = measures[`strMeasure${index+1}`];

            ingredientsList.appendChild(newLi);
            newLi.appendChild(ingredientSpan)
            newLi.appendChild(measureSpan)
        });
        
        /*Object.keys(ingredients).forEach((key) => {
            const newLi = document.createElement("li");
            newLi.textContent = ingredients[key];
            ingredientsList.appendChild(newLi)
        });*/
    } catch(err){
        console.log(err)
    }
}
