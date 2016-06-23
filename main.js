(function( window ) {
  
  var doc = document;
  var $main = doc.querySelector('main');
  var $display;
  var register = [];
  
  function add (a, b) {
    return a+b;
  }

  function subtract(a, b) {
    return a-b;
  }

  function multiply(a, b) {
    return a*b;
  }

  function divide(a, b) {
    return b === 0 ? 'Not a number' : a/b;
  }
 
  
  function addToRegister(item) {
    if (register.length == 3) {
      register = [];
    } 
    register.push(item);
    
  }
  
  function clearRegister() {
    register = [];
  }
  
  function calculate(register) {           
    var result;
    var a = register[0];
    var command = register[1];
    var b = register[2];

    switch (command) {
      case '+': result = add(a, b); 
        break;
      case '-': result = subtract(a, b);
        break;
      case '*': result = multiply(a, b);
        break;
      case '/': result = divide(a, b);
        break;
    }

    // Set up the calculator for the next action.
    addToRegister(result);

    return result;
    
  }
  
  function render() {
    var result;
    if ( register.length < 3) result = register[0];
    if ( register.length == 0) result = 0;
    if ( register.length == 3) result = register[2];
    $display.textContent = result;
  } 

  
  function drawCalculator() {
    // Render the display (where the results appear) first.
    $display = doc.createElement('div');
    $display.className = 'display';
    $main.appendChild($display);
    
    var rows = ['C/', '789*', '456-', '123+', '0='];
    var $table = doc.createElement('table');
    var $tbody = document.createDocumentFragment();

    rows.forEach( function(row, rowIndex) {
      var $row = doc.createElement('tr');
      var isFirstOrLastRow = rowIndex == 0 || rowIndex == 4;

      row.split('').forEach( function(n, cellIndex) {
        var isFirstCell = cellIndex == 0;
        var $td = doc.createElement('td');      
        $td.textContent = n;
                
        if ( isFirstOrLastRow && isFirstCell ) {
          $td.setAttribute('colspan', 3);
        }

        if( isNaN(n) ) {
          $td.setAttribute('data-control', true);
        }

        $row.appendChild($td);
        $tbody.appendChild($row);

      });

      $table.appendChild($tbody);
    });

    $main.appendChild($table);
  }
  
  function handleCommandClick(command) {
      switch ( command ) {
        case 'C': 
          clearRegister();
          break;

        case '=':
          calculate(register);
          break;
          
        default:
          if (register.length == 3) {
            calculate(register);
          }
          addToRegister(command);
          break;
      }
    
     render();
  
  }
  
  function handleNumberClick(entry) {
    var previousEntry = register[register.length-1];
    if (typeof previousEntry == 'number') {
      previousEntry = register.pop();
      entry = previousEntry.toString() + entry;
    } 
    addToRegister(parseInt(entry, 10));
    render();
  }
  

  function listenForEvents() {
    $main.addEventListener('click', function (e) {
      var target = e.target;

      // Ignore any clicks not coming from a calculator key
      if ( target.tagName != 'TD' ) return;

      if ( target.hasAttribute('data-control') ) {
        handleCommandClick(target.textContent);
      } else {
        handleNumberClick(target.textContent);
      }
     }
   );
  }
  
  drawCalculator();
  listenForEvents();
  clearRegister();
  
  // We're done setting up. Initialize the display to 0.
  render();

    
})(window);
