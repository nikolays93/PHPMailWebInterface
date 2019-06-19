jQuery(document).ready(function($) {
    /** Fancybox advance */
    var showPreloader = function() {};
    var hidePreloader = function() {};

    if( $.fancybox ) {
        $.fancybox.defaults.lang = "ru";
        $.fancybox.defaults.i18n.ru = {
            CLOSE: "Закрыть",
            NEXT: "Следующий",
            PREV: "Предыдущий",
            ERROR: "Контент по запросу не найден. <br/> Пожалуйста попробуйте снова, позже.",
            PLAY_START: "Начать слайдшоу",
            PLAY_STOP: "Пауза",
            FULL_SCREEN: "На весь экран",
            THUMBS: "Превью",
            DOWNLOAD: "Скачать",
            SHARE: "Поделиться",
            ZOOM: "Приблизить"
        }

        showPreloader = function(message) {
            if(!message) message = 'Загрузка..';

            $.fancybox.open({
                content  : $('<p>'+message+'</p>').css({ 'margin-top': '50px', 'margin-bottom': '-40px', 'padding-bottom': '', 'color': '#ddd' }),
                type     : 'html',
                smallBtn : false,
                buttons : ["close"],
                afterLoad: function(instance, current) {
                    current.$content.css('background', 'none');
                },
                afterShow: function(instance, current) {
                    instance.showLoading( current );
                },
                afterClose: function(instance, current) {
                    instance.hideLoading( current );
                }
            });
        }

        hidePreloader = function() {
            $.fancybox.getInstance().close();
        };
    }

    /** Send form */
    function disableSubmit( $form, time ) {
        $form.data('submit', 'submitted');
        $('[type="submit"]', $form).attr('disabled', 'disable');

        if( time ) {
            setTimeout(function() {
                $form.data('submit', '');
                $('[type="submit"]', $form).removeAttr('disabled');
            }, time);
        }
    }

    $('[data-ajax-action]').on('submit', function(event) {
        event.preventDefault();
        var $form = $(this);

        showPreloader();
        $('.result', $form).css('opacity', '0');
        if( $form.data('submit') ) return;

        $.post(
            $form.data('ajax-action'),
            $form.serialize(),
            function(data, textStatus, xhr) {
                hidePreloader();
                if( 'success' == data.status ) {
                    $('.result', $form)
                        .removeClass('failure')
                        .addClass('success')
                        .html( data.message )
                        .animate({opacity: 1}, 200);

                    disableSubmit( 30000 );
                }
                else {
                    $('.result', $form)
                        .addClass('failure')
                        .html( data.message )
                        .animate({opacity: 1}, 200);
                }
            },
            'JSON').fail(function() {
                hidePreloader();
                $('.result', $form)
                    .addClass('failure')
                    .html( 'Случилась непредвиденная ошибка. Обратитесь к администратору' )
                    .animate({opacity: 1}, 200);
            });
    });
});
