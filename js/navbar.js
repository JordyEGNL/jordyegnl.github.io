document.addEventListener('DOMContentLoaded', function() {
    let menu = document.querySelector('#navbarIcon');
    let navbar = document.querySelector('.navbarItems');
    let navbarFull = document.querySelector('.navbarFull');
  
    menu.addEventListener('click', function(e) {
        e.stopPropagation(); // prevents event from bubbling up to the document object
        navbar.classList.toggle('open');
        if (navbar.classList.contains('open')) {
          menu.innerHTML = 'close';
        } else {
          menu.innerHTML = 'menu';
        }
  
        
    });

    function calculcateWomanSalary
  
    document.addEventListener('click', function(e) {
      if (!navbarFull.contains(e.target) && e.target !== menu) {
        navbar.classList.remove('open');
        menu.innerHTML = 'menu';
      }
    });
  });

  