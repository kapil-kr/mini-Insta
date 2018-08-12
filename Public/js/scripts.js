$(function(){
    //hiding the comment functionality unless post comment button is clicked.(Jquery)
    $('#post-comment').hide();
    $('#btn-comment').on('click', function(event) {
        event.preventDefault();
        $('#post-comment').show();
    });

    // Handling like functionality.(jquery)
    $('#btn-like').on('click', function(event) {
        event.preventDefault();
        var imgId = $(this).data('id');
        $.post('/images/' + imgId + '/like').done(function(data) {
        $('.likes-count').text(data.likes);
        });
        });
});