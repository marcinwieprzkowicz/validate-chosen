#Validate chosen
Checks the input string by custom function and add to the results if passed the validation

## Demo
See **[demo](http://marcinwieprzkowicz.github.com/validate-chosen/)**.

## Setup

### Html
```html
<div class="validateChosen">
  <select multiple="multiple" data-placeholder="Placeholder"></select>
</div>
```

### JavaScript
```javascript
document.getElements('.validateChosen').set('validateChosen', {
  validator: function(text){
    ...
    return true | false;
  }
});
```

## Options
<table>
  <tr>
    <th class="name">Name</th>
    <th class="provides">Type</th>
    <th class="default">Default</th>
    <th class="description">Description</th>
  </tr>
  <tr>
    <td>validator</td>
    <td>function</td>
    <td>return true;</td>
    <td>Checks the input string</td>
  </tr>
</table>

## Requirements
Validate chosen is written in Mootools(support 1.3+) and uses **[Chosen script](https://github.com/julesjanssen/chosen)**.

## Acknowledgement
Many thanks to Matt Bentley from **[CanIRank](http://www.canirank.com/)** for allowing me to publish this library.

## License
Validate chosen is released under an MIT License.
