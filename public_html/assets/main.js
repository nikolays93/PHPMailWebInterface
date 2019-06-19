jQuery(document).ready(function($) {
    $('[data-ajax-action]').on('submit', function(event) {
        event.preventDefault();
        var $form = $(this);

        $('.result', $form).css('opacity', '0');

        $.post(
            $form.data('ajax-action'),
            $form.serialize(),
            function(data, textStatus, xhr) {
                if( 'success' == data.status ) {
                    $('.result', $form)
                        .removeClass('failure')
                        .addClass('success')
                        .html( data.message )
                        .animate({opacity: 1}, 200);

                    $('[type="submit"]', $form).attr('disabled', 'disable');
                    setTimeout(function() {
                        $('[type="submit"]', $form).removeAttr('disabled');
                    }, 30000);
                }
                else {
                    $('.result', $form)
                        .addClass('failure')
                        .html( data.message )
                        .animate({opacity: 1}, 200);
                }
            },
            'JSON').fail(function() {
                $('.result', $form)
                    .addClass('failure')
                    .html( 'Случилась непредвиденная ошибка. Обратитесь к администратору' )
                    .animate({opacity: 1}, 200);
            });
    });
});
