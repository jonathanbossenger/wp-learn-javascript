( function ( blocks, element, blockEditor ) {
    var el = element.createElement;

    blocks.registerBlockType( 'wp-learn-javascript/javascript-block', {
        edit: function () {
            var blockProps = blockEditor.useBlockProps();
            return el( 'p', blockProps, 'Hello JavaScript World (from the editor).' );
        },
        save: function () {
            var blockProps = blockEditor.useBlockProps.save();
            return el( 'p', blockProps, 'Hello JavaScript World (from the frontend).' );
        },
    } );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor );