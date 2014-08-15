/**
 * The Accessible DD Delegate Component
 *
 * @module aui-accessible-dd-delegate
 */

var CONT = 'container';

var Delegate = A.Component.create({

    NAME: A.DD.Delegate.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Delegate,

    prototype: {
        activeNode: null,

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method initializer
        * @protected
        */
        initializer: function() {
            var instance = this,
                container = A.one(instance.get(CONT));

            instance.container = container;

            instance._handles.push(A.on('focus', A.bind(instance._onMouseEnter, instance), container));
            instance._handles.push(A.on('focus', A.bind(instance._onFocusChange, instance), container));
            instance._handles.push(A.on('blur', A.bind(instance._onMouseLeave, instance), container));

            instance.once('drag:keyDown', instance._onCtrlKeydown, instance);

            container.on('key', A.bind(instance._onCtrlKeyup, instance), 'up:17');

            instance._plugNodeFocusManager();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onFocus
        * @protected
        */
        _onFocusChange: function(event) {
            var instance = this,
                node = event.target;

            instance.dd.detachAll('drag:keyDown');
            instance.dd.detachAll('drag:start');

            instance.dd.set('node', node);

            instance.dd._bindKeyEvents();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeydown
        * @protected
        */
        _onCtrlKeydown: function() {
            var instance = this;

            instance._unplugNodeFocusManager();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeyup
        * @protected
        */
        _onCtrlKeyup: function() {
            var instance = this;

            instance.once('drag:keyDown', instance._onCtrlKeydown, instance);

            instance._plugNodeFocusManager();

            instance.container.focusManager.focus();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _plugNodeFocusManager
        * @protected
        */
        _plugNodeFocusManager: function() {
            var instance = this;

            instance.container.plug(
                A.Plugin.NodeFocusManager, {
                    descendants: instance.get('nodes'),
                    keys: { next: 'down:39', previous: 'down:37' }
                }
            );
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _unplugNodeFocusManager
        * @protected
        */
        _unplugNodeFocusManager: function() {
            var instance = this;

            instance.container.unplug(A.Plugin.NodeFocusManager);
        },
    }
});

A.DD.Delegate = A.mix(Delegate, A.DD.Delegate);
