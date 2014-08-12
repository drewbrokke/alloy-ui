/**
 * The Accessible DD Delegate Component
 *
 * @module aui-accessible-dd-delegate
 */

var CONT = 'container',
    DOC = A.config.doc,
    DDM = A.DD.DDM;

var Delegate = A.Component.create({

    NAME: A.DD.Delegate.NAME,

    ATTRS: {},

    EXTENDS: A.DD.Delegate,

    prototype: {
        activeNode: null,
        mouseAtTop: false,

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method initializer
        * @protected
        */
        initializer: function() {
            var instance = this,
                container = A.one(instance.get(CONT)),
                index = instance.get('tabIndex');

            instance._handles.push(A.on('focus', A.bind(instance._onMouseEnter, instance), container));

            instance._handles.push(A.on('focus', A.bind(instance._onFocusChange, instance), container));

            instance._handles.push(A.on('blur', A.bind(instance._onMouseLeave, instance), container));

            instance._handles.push(
                instance.dd.on('setTarget', function(event) {
                    if (DDM.activeDrag) {
                        instance._simulateMouseXY(DDM.activeDrag);
                    }
                })
            );

            instance._bindKeypressEvent();

            instance._plugNodeFocusManager();
        },

        _afterDragEnd: function(event) {
            var instance = this,
                drag = event.target,
                dragNode = drag.get('node');

            dragNode.focus();

            instance._plugNodeFocusManager();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onFocus
        * @protected
        */
        _onFocusChange: function(event) {
            var instance = this;
            var target = event.target;
            var nodesClass = instance.get('nodes');

            instance.activeNode = target;
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _bindKeypressEvent
        * @protected
        */
        _bindKeypressEvent: function(node) {
            var instance = this;
            var container = A.one(instance.get(CONT));

            instance.once('drag:keyDown', A.bind(instance._defKeyDownFn, instance));
            instance.once('drag:start', A.bind(instance._onDragStart, instance));
            instance.onceAfter('drag:end', A.bind(instance._afterDragEnd, instance));

            container.once('key', A.bind(instance._onCtrlKeydown, instance), 'down:17');
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _defKeyDownFn
        * @protected
        */
        _defKeyDownFn: function(event) {
            var instance = this,
                doc = A.one(DOC),
                container = instance.get(CONT),
                ev = event.ev;

            ev.button = 1;
            ev.currentTarget = instance.activeNode;

            instance._delMouseDown(ev);

            doc.once('key', A.bind(instance._onCtrlKeyup, instance), 'up:17');
            event.halt();
        },

        /**
         * Gets a list of valid drop targets for the drag object.
         *
         * @method _getDropTargets
         * @protected
         * @return {A.NodeList}
         */
        _getDropTargets: function() {
            var instance = this;
            var container = A.one(instance.get(CONT));

            return container.all('.' + DDM.CSS_PREFIX + '-drop');
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeydown
        * @protected
        */
        _onCtrlKeydown: function(event) {
            var instance = this;

            instance._unplugNodeFocusManager();

            instance.fire('drag:keyDown', {ev: event});
            event.halt();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onCtrlKeyup
        * @protected
        */
        _onCtrlKeyup: function(event) {
            var instance = this;

            instance.fire('drag:mouseup');

            if (DDM.activeDrag) {
                DDM._end();
            }

            if (instance._handle) {
                instance._handle.detach();

                event.target.focus();
            }

            instance._bindKeypressEvent();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _onDragStart
        * @protected
        */
        _onDragStart: function(event) {
            var instance = this,
                drag = event.target,
                doc = A.one(DOC),
                dragNode = drag.get('node');

            instance._targets = instance._getDropTargets();

            instance._currentTarget = instance._targets.indexOf(dragNode);

            instance._currentTarget = instance._currentTarget ? instance._currentTarget - 1 : instance._currentTarget;

            event.halt();
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _plugNodeFocusManager
        * @protected
        */
        _plugNodeFocusManager: function() {
            var instance = this,
                container = A.one(instance.get(CONT));

            container.plug(A.Plugin.NodeFocusManager, {
                descendants: instance.get('nodes'),
                keys: { next: 'down:39', previous: 'down:37' }
            });
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _simulateMouseXY
        * @protected
        */
        _simulateMouseXY: function(drag) {
            if (drag) {
                var nodeXY = drag.nodeXY,
                    node = drag.get('dragNode'),
                    win = A.getWin();

                if (!this.mouseAtTop) {
                    nodeXY[0] = win.width();
                    nodeXY[1] = win.height();
                }
                else {
                    nodeXY[0] = 0;
                    nodeXY[1] = 0;
                }

                drag.mouseXY = nodeXY;
                this.mouseAtTop = !this.mouseAtTop;
            }
        },

        /**
        * TODO. Wanna help? Please send a Pull Request.
        *
        * @method _unplugNodeFocusManager
        * @protected
        */
        _unplugNodeFocusManager: function() {
            var instance = this,
                container = A.one(instance.get(CONT));

            container.unplug(A.Plugin.NodeFocusManager);
        },
    }
});

A.DD.Delegate = A.mix(Delegate, A.DD.Delegate);
