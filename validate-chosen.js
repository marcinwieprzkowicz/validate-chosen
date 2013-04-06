/*

 Checks the input string by custom function and add to the results if passed the validation

 version    1.0
 author     Marcin Wieprzkowicz (wiemar@o2.pl)

*/

Elements.implement({
  validateChosen: function(options){
    return this.each(function(el){
      new ValidateChosen(el, options);
    });
  }
});

var ValidateChosen = new Class({

  Implements: [Options, Events],

  options: {
    validator: function(){
      return true;
    }
  },

  initialize: function(el, options){
    this.setOptions(options);
    this.elements = {
      rootEl: el,
      selectEl: el.getElement('select')
    };

    this.chosen = new Chosen(this.elements.selectEl);
    this.addEvents();
  },

  addEvents: function(){
    this.elements.rootEl.addEvents({
      'keyup:relay(input)': function(event, el){
        var value = el.get('value');
        if (value.length === 0){
          this.clean();
        }
        else if (this.options.validator.call(this, value)){
          this.setValid();
          if (event.key === 'enter'){
            this.addElement(value);
            el.set('value', '');
          }
        }
        else {
          this.setInvalid();
        }
      }.bind(this),
      blue: function(){
        this.clean();
      }.bind(this),
      focus: function(){
        this.clean();
      }.bind(this)
    });

    // click on element
    this.elements.rootEl.addEvent('click:relay(.no-results)', function(event, el){
      var value = el.getElement('span').get('text');
      if (this.options.validator.call(this, value)){
        this.addElement(value);
      }
    }.bind(this));

    // remove element
    this.elements.rootEl.addEvent('click:relay(.search-choice-close)', function(event, el){
      var index = parseInt(el.get('rel'), 10);

      this.chosen.results_data.erase(this.chosen.results_data[index]);  // remove from chosen
      this.elements.selectEl.options[index].destroy();                  // remove option from select
      document.id(this.chosen.container_id + '_o_' + index).destroy();  // remove from chosen results

      // recalculate indexes
      if (this.chosen.results_data.length > 0){
        this.recalculateObjects(index);
      }
    }.bind(this));
  },

  recalculateObjects: function(index){
    var last = this.chosen.results_data.getLast().array_index;

    while(index < last){
      var newIndex = index + 1;

      this.chosen.results_data[index] = {
        'array_index': index,
        'options_index': index,
        'dom_id': this.chosen.container_id + "_c_" + index
      };

      this.elements.selectEl.options[index].id = this.chosen.container_id + "_c_" + index;

      var result = document.id(this.chosen.container_id + "_c_" + newIndex);
      result.getElement('.search-choice-close').set('rel', index);
      result.set('id', this.chosen.container_id + "_c_" + index);

      document.id(this.chosen.container_id + "_o_" + newIndex).set('id', this.chosen.container_id + "_o_" + index);
      index++;
    }
  },

  clean: function(){
    this.elements.rootEl.removeClass('valid');
    this.elements.rootEl.removeClass('invalid');
  },

  setValid: function(){
    console.log('valid');
    this.elements.rootEl.removeClass('invalid');
    this.elements.rootEl.addClass('valid');
  },

  setInvalid: function(){
    console.log('invalid');
    this.elements.rootEl.removeClass('valid');
    this.elements.rootEl.addClass('invalid');
  },

  addElement: function(value){
    var index = this.elements.selectEl.options.length;
    var dom_id = this.chosen.container_id + "_c_" + index;
    var html_safe = value.replace(/[<>\/]/g, '');

    this.chosen.results_data[index] = {
      'array_index': index,
      'options_index': index,
      'value': value,
      'text': value,
      'html': html_safe,
      'selected': true,
      'dom_id': dom_id
    };

    new Element('li', {
      'id': this.chosen.container_id + "_o_" + index,
      'class': 'result-selected',
      'text': value
    }).inject(this.chosen.search_results);

    var option = new Element('option', {
      'id': dom_id,
      'value': value,
      'selected': 'selected'
    }).inject(this.elements.selectEl, 'bottom');

    this.chosen.choice_build({
      'array_index': index,
      'html': html_safe
    });

    this.chosen.no_results_clear();
    this.clean();
  }

});
