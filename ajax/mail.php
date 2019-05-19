<?php

use NikolayS93\PHPMailInterface;

// @note fix path to Composer's autoloader
require __DIR__ . '/../vendor/autoload.php';

/** @var bool  must be empty for spam filter */
$is_spam = !empty($_POST["surname"]);
if( $is_spam ) { header($_SERVER['SERVER_PROTOCOL'] . ' 403 Forbidden', true, 403); die(); }

$MailIO = new PHPMailInterface();

/**
 * User Name who sent message: %s <no-reply@domain.ltd>
 */
$MailIO->fromName = 'TestName';

/**
 * Mail subject
 */
$MailIO->Subject = 'Сообщение с сайта';

/**
 * Address where to send the message
 */
$MailIO->addAddress('nikolays93@ya.ru');

/**
 * Mail carbon copy
 */
// $MailIO->addCC('trashmailsizh@ya.ru');

/**
 * Add new field
 * @param $key
 * @param $fieldName
 */
$MailIO->addField( 'test-name', 'Тестовое имя' );

/**
 * Field with this key must be filled
 */
$MailIO->setRequired('phone');

/**
 * @var array List field key => sanitized requested value
 */
$fields = $MailIO->getFields();

/**
 * @var array List field key => field name (title/label)
 */
$fieldNames = $MailIO->getFieldNames();

/**
 * Message is HTML
 */
// $MailIO->isHTML(true);

/**
 * Collect information on email body
 */
foreach ($fields as $key => $value)
{
    if( $value ) $MailIO->Body.= $fieldNames[$key] . ": $value\r\n";
}

/**
 * Technical additional information
 */
if( $MailIO->Body ) {
    $MailIO->Body.= "\r\n";
    $MailIO->Body.= "URI запроса: ". $_SERVER['REQUEST_URI'] . "\r\n";
    $MailIO->Body.= "URL источника запроса: ". str_replace($MailIO::$protocol . ':', '', $_SERVER['HTTP_REFERER']) . "\r\n";
}

$MailIO->sendMail();
$MailIO->showResult();