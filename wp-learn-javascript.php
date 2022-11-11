<?php
/**
 * Plugin Name: WP Learn Javascript: Basic Block
 * Version: 0.0.2
 */

add_action( 'init', 'wp_learn_javascript_register_block' );
function wp_learn_javascript_register_block() {
	register_block_type( __DIR__ );
}

