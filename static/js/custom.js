$(function () {
  var $heading = $('h1,h2,h3,h4,h5,h6');

  $heading.filter('[id]').each(function () {
    $(this).append(' <a href="#' + $(this).attr('id') + '" ' +
      'class="paragraph-link" style="display:none"><i class="fas fa-link"></i></a>');
  });

  $heading
    .on('mouseover', function () {
      $(this).find('a').show();
    })
    .on('mouseout', function () {
      $(this).find('a').hide();
    });
});
