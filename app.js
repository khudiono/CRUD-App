$(document).ready(function(){
  // localStorage.clear();

  function clearHTML(){
    $('.allRecipes').html('');
    $('.recipe-buttons').html('');
  }

  function clearField(){
    $('.recipeName').val('');
    $('.recipe').val('');
  }

  function deleteRecipe(div){
    $('#' + div).html('');
    localStorage.removeItem('recipeName-' +div);
    localStorage.removeItem('recipeIngr-' +div);
  }


  function createRecipe(recipeName, recipe, nameWithSpaces){
    var divID = '#' + recipeName;
    $(".allRecipes").prepend('<br><div class="recipePost" id="'+ recipeName +'" </div>')
    $(divID).append('<input class="rName" size=50 style="font-size:20px; font-weight: bold;" value="'+ nameWithSpaces + '" readonly></input><br><textarea class="recipe-text" cols="80" class="recipe-input" readonly>' +recipe + '</textarea><br>');
    $(divID).append('<button class = "btn-edit" id="btn-edit-'+recipeName+'"type="button">Edit</button>');
    $(divID).append('<button class = "btn-delete-recipe" id="btn-delete-'+recipeName+'" type="button" >Delete</button><br>');
  }

  // populate local storage onto page
  if(localStorage.length > 1){
    for (var i = 0; i < localStorage.length; i++){
      var key = localStorage.key(i);
      if (key.split('-')[0] === 'recipeIngr'){
        var value = localStorage[key];
        createRecipe(key.split('-').splice(1).join('-'), value, key.split('-').splice(1).join(' '))
      }
    }
  }


  function newRecipe(){
    var name = $('.recipeName').val().split(' ').join('-');
    var nameWithSpaces = $('.recipeName').val();
    var details = $('.recipe').val();
    localStorage.setItem('recipeName-' + name, name);
    localStorage.setItem('recipeIngr-' + name, details);
    var recipeName = localStorage.getItem('recipeName-' + name);
    var recipe = localStorage.getItem('recipeIngr-'+ name);
    var time = new Date();

    clearField();
    createRecipe(recipeName, recipe, nameWithSpaces);
  }

  $('.btn-submit').on('click', function(){
    var name = $('.recipeName').val().split(' ').join('-');
    var recipeName = localStorage.getItem('recipeName-' + name)
    if(recipeName){
      alert('Recipe name already exists')
    }
    if(document.querySelector('#write-form').reportValidity() && !recipeName){
      newRecipe();
    }
  });

  $('.btn-clear').on('click', function(){
    clearField();
  })

  $('.btn-delete').on('click', function(){
    if (window.confirm("Do you really want to delete everything?")){
      clearHTML();
      localStorage.clear(); // clear all local storage
    }
  });

  $('.allRecipes').on('click', function(e){
    var closestDiv = e.target.closest('div').id;
    var buttonPressed = e.target.className;

    if(buttonPressed === "btn-edit"){
      var recipeName = e.target.closest('div').childNodes[0];
      var recipeIngredients = e.target.closest('div').childNodes[2];
      recipeIngredients.readOnly= false;
      var targetRecipe = '#'+e.target.id;

      //Hide 'edit' and 'delete' button and show 'save' button
      $(targetRecipe).hide()
      $('#btn-delete-'+recipeName.value.split(' ').join('-')).hide();
      $('#'+closestDiv).append('<button class = "btn-save" type="button">Save</button>')

      //save when 'save' is clicked and remove button
      $('.btn-save').on('click',function(){
        recipeIngredients.readOnly= true;

        //update local storage
        localStorage.setItem('recipeIngr-' + recipeName.value.split(' ').join('-'), recipeIngredients.value);

        //hide save button, show edit + delete button
        $('.btn-save').hide();
        $(targetRecipe).show();
        $('#btn-delete-'+recipeName.value.split(' ').join('-')).show();
      })

    }
    if (buttonPressed === "btn-delete-recipe"){
      if(window.confirm("Are you sure you want to delete this recipe?")){
        deleteRecipe(closestDiv);
      }
    }
  });


// API calls to Yummly
  var appID = config.app_id;
  var appKey = config.app_key;

  function makeCard(recipeID, img, name){
    $('.recipe-cards').append(`<a id="recipeCard" href="https://www.yummly.com/recipe/${recipeID}" style="color:black;"><div class="card"><img src="${img}" alt="cookie" style="width: 100%; border-radius: 10px;"><div class="container"><h4>${name}</h4></div></div></a>`)
  }

  function getApiData(url){
    $.getJSON(url, function(result){
      for (var i = 0; i < result.matches.length; i++){
        var name = result.matches[i].recipeName;
        var img = result.matches[i].imageUrlsBySize['90'];
        var recipeID = result.matches[i].id;
        makeCard(recipeID, img, name);
        console.log(result.matches[i].recipeName);
        console.log(result.matches[i].id);
        console.log(result.matches[i].imageUrlsBySize['90']);
      }
    })
  };


  $('.searchButton').on('click', function(e){
    $('.recipe-cards').html('');
    var search = $('.searchInput').val().split(' ').join('+');
    var url = `http://api.yummly.com/v1/api/recipes?_app_id=${appID}&_app_key=${appKey}&q=${search}`;

    e.preventDefault();
    getApiData(url);
    $('.searchInput').val('');

  });

});
