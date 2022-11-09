( function ( blocks, element ) {
    var el = element.createElement;

    blocks.registerBlockType( 'wp-learn-javascript/javascript-block', {
        edit: function () {
            return el( 'p', {}, 'Hello JavaScript World (from the editor).' );
        },
        save: function () {
            return el( 'p', {}, 'Hello JavaScript World (from the frontend).' );
        },
    } );
} )( window.wp.blocks, window.wp.element );