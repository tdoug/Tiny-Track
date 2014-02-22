$(document).on('submit', '#food_log_entry_form', function(e) {
  // Form being submitted
  var form = e.currentTarget;
  // Issue an ajax request
  $.ajax({
    url: form.action,          // the forms 'action' attribute
    type: 'POST',               // use 'PUT' (not supported in all browsers)
                               // Alt. the 'method' attribute (form.method)
    data: $(form).serialize(), // Serialize the form's fields and values
    success: function() { 
      var food_date = $('input[name=food_date]').val();
      $('#food_data').load('/log_data?food_date=' + food_date); 
      $('#food_log_entry_form')[0].reset();
    },
    error: function() {}
  });
  // Prevent the browser from submitting the form
  e.preventDefault();
});

$(document).on('click', '#del_food', function(e)
{
  var this_record_id = $(this).attr('record_id');
  $.post('/log_entries',{op:'delete_log_entry', record_id: this_record_id}, function()
    {
      var food_date = $('input[name=food_date]').val();
      $('#food_data').load('/log_data?food_date=' + food_date); 
    });
});

$(document).on('click', '#datepick', function(e)
{
  e.preventDefault();
  $('input[name=hidden_datepicker]').trigger('click');
});

$(document).on('change', 'input[name=hidden_datepicker]', function(e){
  var new_date = $(this).val();
  var new_stamp = Date.parse(new_date);
  $('#datepick').html(new_date + " <span class=\"caret\"></span>");
  $('input[name=food_date]').val(new_stamp);
  $('.log_header').html(new_date);
  $('#food_data').load('/log_data?food_date=' + new_stamp); 

});

$(document).ready(function(){
  var food_date = $('input[name=food_date]').val();
  $('#food_data').load('/log_data?food_date=' + food_date);
  $('input[name=hidden_datepicker]').pickadate(
    {format:'mm/dd/yy',
    min: new Date(2013,12,31),
    max: new Date()
  });
});
