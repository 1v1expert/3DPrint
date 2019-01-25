// source: js/app/bindings/allowbindings.js
ko.bindingHandlers.allowBindings = {
    init: function (elem, valueAccessor) {
        return { controlsDescendantBindings: !valueAccessor() };
    }
};
ko.virtualElements.allowedBindings.allowBindings = true;

;

// source: js/app/bindings/contextmenu.js
ko.bindingHandlers.contextMenu = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var val = ko.utils.unwrapObservable(valueAccessor());

        $(element).contextMenu(val);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var val = ko.utils.unwrapObservable(valueAccessor());

        $(element).contextMenu(val);
    }
};

;

// source: js/app/bindings/copywidth.js
ko.bindingHandlers.copyWidth = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var node = ko.bindingHandlers.copyWidth._getReferenceNode(element, valueAccessor);
        ko.bindingHandlers.copyWidth._setWidth(node, element);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var node = ko.bindingHandlers.copyWidth._getReferenceNode(element, valueAccessor);
        ko.bindingHandlers.copyWidth._setWidth(node, element);
    },
    _setWidth: function(node, element) {
        var width = node.width();
        if (!width) return;
        if ($(element).width() == width) return;
        element.style.width = width + "px";
    },
    _getReferenceNode: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (!value) return;

        var parts = value.split(" ");
        var node = $(element);
        while (parts.length > 0) {
            var part = parts.shift();
            if (part == ":parent") {
                node = node.parent();
            } else {
                var selector = part;
                if (parts.length > 0) {
                    selector += " " + parts.join(" ");
                }
                node = $(selector, node);
                break;
            }
        }
        return node;
    }
};


;

// source: js/app/bindings/invisible.js
ko.bindingHandlers.invisible = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (!valueAccessor()) return;
        ko.bindingHandlers.style.update(element, function() {
            return { visibility: 'hidden' };
        })
    }
};

;

// source: js/app/bindings/popover.js
ko.bindingHandlers.popover = {
    keys: ["title", "animation", "placement", "trigger", "delay", "content", "html"],

    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var val = ko.utils.unwrapObservable(valueAccessor());

        var keys = ko.bindingHandlers.popover.keys;
        var options = {};
        _.each(keys, function(key) {
            options[key] = ko.utils.unwrapObservable(val[key]);
        });

        $(element).popover(options);
    },

    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var val = ko.utils.unwrapObservable(valueAccessor());

        var keys = ko.bindingHandlers.popover.keys;
        var value;
        _.each(keys, function(key) {
            value = ko.utils.unwrapObservable(val[key]);
            $(element).data("popover").options[key] = value;
        });
    }
};

;

// source: js/app/bindings/qrcode.js
ko.bindingHandlers.qrcode = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var val = ko.utils.unwrapObservable(valueAccessor());

        var defaultOptions = {
            text: "",
            size: 200,
            fill: "#000",
            background: null,
            label: "",
            fontname: "sans",
            fontcolor: "#000",
            radius: 0,
            ecLevel: "L"
        };

        var options = {};
        _.each(defaultOptions, function(value, key) {
            options[key] = ko.utils.unwrapObservable(val[key]) || value;
        });

        $(element).empty().qrcode(options);
    }
};

;

// source: js/app/bindings/slimscrolledforeach.js
ko.bindingHandlers.slimScrolledForeach = {
    makeTemplateValueAccessor: function(valueAccessor) {
        var modelValue = valueAccessor(),
            unwrappedValue = ko.utils.peekObservable(modelValue),    // Unwrap without setting a dependency here
            result, slimscroll;

        // If unwrappedValue is the array, pass in the wrapped value on its own
        // The value will be unwrapped and tracked within the template binding
        // (See https://github.com/SteveSanderson/knockout/issues/523)
        if ((!unwrappedValue) || typeof unwrappedValue.length === "number") {
            result = { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };
            slimscroll = {};
        } else {
            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            result =  {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
            slimscroll = unwrappedValue['slimscroll'];
        }

        return {accessor: function() { return result; }, slimscroll: slimscroll};
    },

    slimscroll: function(element, options) {
        options = options || {};
        setTimeout(function() {
            if (element.nodeName === "#comment") {
                // foreach is bound to a virtual element
                $(element.parentElement).slimScroll(options);
            } else {
                $(element).slimScroll(options);
            }
        }, 10);
    },

    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var prepped = ko.bindingHandlers["slimScrolledForeach"].makeTemplateValueAccessor(valueAccessor);
        ko.bindingHandlers["slimScrolledForeach"].slimscroll(element, prepped.slimscroll);
        return ko.bindingHandlers['template']['init'](element, prepped.accessor);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var prepped = ko.bindingHandlers["slimScrolledForeach"].makeTemplateValueAccessor(valueAccessor);
        var options = $.extend(prepped.slimscroll, {scrollBy: 0});
        ko.bindingHandlers["slimScrolledForeach"].slimscroll(element, options);
        return ko.bindingHandlers['template']['update'](element, prepped.accessor, allBindings, viewModel, bindingContext);
    }
};
ko.virtualElements.allowedBindings.slimScrolledForeach = true;

;

// source: js/app/bindings/toggle.js
// Originally from Knockstrap
// https://github.com/faulknercs/Knockstrap/blob/master/src/bindings/toggleBinding.js
// License: MIT
ko.bindingHandlers.toggle = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();

        if (!ko.isObservable(value)) {
            throw new Error('toggle binding should be used only with observable values');
        }

        $(element).on('click', function (event) {
            event.preventDefault();

            var previousValue = ko.utils.unwrapObservable(value);
            value(!previousValue);
        });
    },

    update: function (element, valueAccessor) {
        ko.utils.toggleDomNodeCssClass(element, 'active', ko.utils.unwrapObservable(valueAccessor()));
    }
};


;

// source: js/app/bindings/togglecontent.js
ko.bindingHandlers.toggleContent = {
    init: function(element, valueAccessor) {
        var $elm = $(element),
            options = $.extend({
                class: null,
                container: null,
                parent: null,
                onComplete: function() {
                    $(document).trigger("slideCompleted");
                }
            }, valueAccessor());

        $elm.on("click", function(e) {
            e.preventDefault();
            if(options.class) {
                $elm.children('[class^="icon-"]').toggleClass(options.class);
                $elm.children('[class^="fa"]').toggleClass(options.class);
            }
            if(options.container) {
                if(options.parent) {
                    $elm.parents(options.parent).find(options.container).stop().slideToggle('fast', options.onComplete);
                } else {
                    $(options.container).stop().slideToggle('fast', options.onComplete);
                }
            }

        });
    }
};

;

// source: js/app/bindings/valuewithinit.js
ko.bindingHandlers.valueWithInit = {
    init: function(element, valueAccessor, allBindingsAccessor, context) {
        var observable = valueAccessor();
        var value = element.value;

        observable(value);

        ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor, context);
    },
    update: ko.bindingHandlers.value.update
};
;

// source: js/app/viewmodels/appearance.js
$(function() {
    var save = {};

    // Using the theme color (for the top bar), also recolor the favicon tentacle.
    function themeFavicon(colorname) {
        save.colorName = colorname;

        // the following is from an Apache licensed snippet:
        // http://blog.roomanna.com/09-24-2011/dynamically-coloring-a-favicon
        var link = document.querySelector("link[rel='shortcut icon']");
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "shortcut icon");
            document.head.appendChild(link);
        }

        // try to get the best quality ico possible; prefer svg, the apple-touch pngs are more difficult,
        // but all three of the others give a high-quality ico.
        var faviconUrl = document.querySelector("link[rel~='mask-icon-theme']").href
            || link.href
            || window.location.origin + "/favicon.ico";

        function onImageLoaded() {
            var icosize = 256;

            var canvas = document.createElement("canvas");
            canvas.width = icosize;
            canvas.height = icosize;

            var context = canvas.getContext("2d");

            function grayscale() {
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
                    pixels = imageData.data,
                    i, l, r, g, b, a, luma;

                for (i = 0, l = pixels.length; i < l; i += 4) {
                    a = pixels[i + 3];
                    if (a === 0) { continue; }

                    r = pixels[i];
                    g = pixels[i + 1];
                    b = pixels[i + 2];

                    luma = r * 0.2126 + g * 0.7152 + b * 0.0722;

                    pixels[i] = pixels[i + 1] = pixels[i + 2] = luma;
                }

                context.putImageData(imageData, 0, 0);
            }

            function colorize(color, alpha) {
                context.globalCompositeOperation = "source-atop";
                context.globalAlpha = alpha;
                context.fillStyle = color;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.globalCompositeOperation = "source-over";
                context.globalAlpha = 1.0;
            }

            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            if (save.colorName !== "default") {
                grayscale();
                colorize(save.colorName, .3);
            }
            link.type = "image/x-icon";
            link.href = canvas.toDataURL();
        }

        var img = document.createElement("img");
        img.addEventListener("load", onImageLoaded);
        img.src = faviconUrl;
    }

    function AppearanceViewModel(parameters) {
        var self = this;

        self.name = parameters[0].appearance_name;
        self.color = parameters[0].appearance_color;
        self.colorTransparent = parameters[0].appearance_colorTransparent;
        self.colorIcon = parameters[0].appearance_colorIcon;

        function updateIcon() {
            if (self.colorIcon()) {
                themeFavicon(self.color());
            } else {
                themeFavicon("default");
            }
        }
        self.color.subscribe(updateIcon);
        self.colorIcon.subscribe(updateIcon);
        updateIcon();

        self.brand = ko.pureComputed(function() {
            if (self.name())
                return self.name();
            else
                return gettext("OctoPrint");
        });

        self.fullbrand = ko.pureComputed(function() {
            if (self.name())
                return gettext("OctoPrint") + ": " + self.name();
            else
                return gettext("OctoPrint");
        });

        self.title = ko.pureComputed(function() {
            if (self.name())
                return self.name() + " [" + gettext("OctoPrint") + "]";
            else
                return gettext("OctoPrint");
        });
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: AppearanceViewModel,
        dependencies: ["settingsViewModel"],
        elements: ["head"]
    });
});

;

// source: js/app/viewmodels/connection.js
$(function() {
    function ConnectionViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];
        self.printerProfiles = parameters[2];

        self.printerProfiles.profiles.items.subscribe(function() {
            var allProfiles = self.printerProfiles.profiles.items();

            var printerOptions = [];
            _.each(allProfiles, function(profile) {
                printerOptions.push({id: profile.id, name: profile.name});
            });
            self.printerOptions(printerOptions);
        });

        self.printerProfiles.currentProfile.subscribe(function() {
            self.selectedPrinter(self.printerProfiles.currentProfile());
        });

        self.portOptions = ko.observableArray(undefined);
        self.baudrateOptions = ko.observableArray(undefined);
        self.printerOptions = ko.observableArray(undefined);
        self.selectedPort = ko.observable(undefined);
        self.selectedBaudrate = ko.observable(undefined);
        self.selectedPrinter = ko.observable(undefined);
        self.saveSettings = ko.observable(undefined);
        self.autoconnect = ko.observable(undefined);

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.buttonText = ko.pureComputed(function() {
            if (self.isErrorOrClosed())
                return gettext("Connect");
            else
                return gettext("Disconnect");
        });

        self.previousIsOperational = undefined;

        self.refreshVisible = ko.observable(true);

        self.requestData = function() {
            OctoPrint.connection.getSettings()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            var ports = response.options.ports;
            var baudrates = response.options.baudrates;
            var currentPort = response.current.port;
            var currentBaudrate = response.current.baudrate;
            var currentPrinterProfile = response.current.printerProfile;
            var portPreference = response.options.portPreference;
            var baudratePreference = response.options.baudratePreference;
            var printerPreference = response.options.printerProfilePreference;
            var printerProfiles = response.options.printerProfiles;

            self.portOptions(ports);
            self.baudrateOptions(baudrates);

            if (!self.selectedPort() && ports) {
                if (ports.indexOf(currentPort) >= 0) {
                    self.selectedPort(currentPort);
                } else if (ports.indexOf(portPreference) >= 0) {
                    self.selectedPort(portPreference);
                }
            }
            if (!self.selectedBaudrate() && baudrates) {
                if (baudrates.indexOf(currentBaudrate) >= 0) {
                    self.selectedBaudrate(currentBaudrate);
                } else if (baudrates.indexOf(baudratePreference) >= 0) {
                    self.selectedBaudrate(baudratePreference);
                }
            }
            if (!self.selectedPrinter() && printerProfiles) {
                if (printerProfiles.indexOf(currentPrinterProfile) >= 0) {
                    self.selectedPrinter(currentPrinterProfile);
                } else if (printerProfiles.indexOf(printerPreference) >= 0) {
                    self.selectedPrinter(printerPreference);
                }
            }

            self.saveSettings(false);
        };

        self.fromHistoryData = function(data) {
            self._processStateData(data.state);
        };

        self.fromCurrentData = function(data) {
            self._processStateData(data.state);
        };

        self.openOrCloseOnStateChange = function() {
            var connectionTab = $("#connection");
            if (self.isOperational() && connectionTab.hasClass("in")) {
                connectionTab.collapse("hide");
            } else if (!self.isOperational() && !connectionTab.hasClass("in")) {
                connectionTab.collapse("show");
            }
        };

        self._processStateData = function(data) {
            self.previousIsOperational = self.isOperational();

            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);

            if (self.loginState.isUser() && self.previousIsOperational !== self.isOperational()) {
                // only open or close if the panel is visible (for admins) and
                // the state just changed to avoid thwarting manual open/close
                self.openOrCloseOnStateChange();
            }
        };

        self.connect = function() {
            if (self.isErrorOrClosed()) {
                var data = {
                    "port": self.selectedPort() || "AUTO",
                    "baudrate": self.selectedBaudrate() || 0,
                    "printerProfile": self.selectedPrinter(),
                    "autoconnect": self.settings.serial_autoconnect()
                };

                if (self.saveSettings())
                    data["save"] = true;

                OctoPrint.connection.connect(data)
                    .done(function() {
                        self.settings.requestData();
                        self.settings.printerProfiles.requestData();
                    });
            } else {
                if (!self.isPrinting() && !self.isPaused()) {
                    self.requestData();
                    OctoPrint.connection.disconnect();
                } else {
                    showConfirmationDialog({
                        title: gettext("Are you sure?"),
                        message: gettext("<p><strong>You are about to disconnect from the printer while a print "
                            + "is in progress.</strong></p>"
                            + "<p>Disconnecting while a print is in progress will prevent OctoPrint from "
                            + "completing the print. If you're printing from an SD card attached directly "
                            + "to the printer, any attempt to restart OctoPrint or reconnect to the printer "
                            + "could interrupt the print.<p>"),
                        question: gettext("Are you sure you want to disconnect from the printer?"),
                        cancel: gettext("Stay Connected"),
                        proceed: gettext("Disconnect"),
                        onproceed:  function() {
                            self.requestData();
                            OctoPrint.connection.disconnect();
                        }
                    })
                }
            }
        };

        self.onEventSettingsUpdated = function() {
            self.requestData();
        };

        self.onEventConnected = function() {
            self.requestData();
        };

        self.onStartup = function() {
            var connectionTab = $("#connection");
            connectionTab.on("show", function() {
                self.refreshVisible(true);
            });
            connectionTab.on("hide", function() {
                self.refreshVisible(false);
            });

            self.requestData();
        };

        self.onUserLoggedIn = function() {
            self.openOrCloseOnStateChange();
        };

        self.onUserLoggedOut = function() {
            self.openOrCloseOnStateChange();
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: ConnectionViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel", "printerProfilesViewModel"],
        elements: ["#connection_wrapper"]
    });
});

;

// source: js/app/viewmodels/control.js
$(function() {
    function ControlViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];

        self._createToolEntry = function () {
            return {
                name: ko.observable(),
                key: ko.observable()
            }
        };

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.extrusionAmount = ko.observable(undefined);
        self.controls = ko.observableArray([]);

        self.distances = ko.observableArray([0.1, 1, 10, 100]);
        self.distance = ko.observable(10);

        self.tools = ko.observableArray([]);

        self.feedRate = ko.observable(100);
        self.flowRate = ko.observable(100);

        self.feedbackControlLookup = {};

        self.controlsFromServer = [];
        self.additionalControls = [];

        self.webcamDisableTimeout = undefined;
        self.webcamLoaded = ko.observable(false);
        self.webcamError = ko.observable(false);

        self.keycontrolActive = ko.observable(false);
        self.keycontrolHelpActive = ko.observable(false);
        self.keycontrolPossible = ko.pureComputed(function () {
            return self.settings.feature_keyboardControl() && self.isOperational() && !self.isPrinting() && self.loginState.isUser() && !$.browser.mobile;
        });
        self.showKeycontrols = ko.pureComputed(function () {
            return self.keycontrolActive() && self.keycontrolPossible();
        });

        self.webcamRatioClass = ko.pureComputed(function() {
            if (self.settings.webcam_streamRatio() == "4:3") {
                return "ratio43";
            } else {
                return "ratio169";
            }
        });

        self.settings.printerProfiles.currentProfileData.subscribe(function () {
            self._updateExtruderCount();
            self.settings.printerProfiles.currentProfileData().extruder.count.subscribe(self._updateExtruderCount);
        });
        self._updateExtruderCount = function () {
            var tools = [];

            var numExtruders = self.settings.printerProfiles.currentProfileData().extruder.count();
            if (numExtruders > 1) {
                // multiple extruders
                for (var extruder = 0; extruder < numExtruders; extruder++) {
                    tools[extruder] = self._createToolEntry();
                    tools[extruder]["name"](gettext("Tool") + " " + extruder);
                    tools[extruder]["key"]("tool" + extruder);
                }
            } else {
                // only one extruder, no need to add numbers
                tools[0] = self._createToolEntry();
                tools[0]["name"](gettext("Hotend"));
                tools[0]["key"]("tool0");
            }

            self.tools(tools);
        };

        self.fromCurrentData = function (data) {
            self._processStateData(data.state);
        };

        self.fromHistoryData = function (data) {
            self._processStateData(data.state);
        };

        self._processStateData = function (data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };

        self.onEventSettingsUpdated = function (payload) {
            // the webcam url might have changed, make sure we replace it now if the tab is focused
            self._enableWebcam();
            self.requestData();
        };

        self.onEventRegisteredMessageReceived = function(payload) {
            if (payload.key in self.feedbackControlLookup) {
                var outputs = self.feedbackControlLookup[payload.key];
                _.each(payload.outputs, function(value, key) {
                    if (outputs.hasOwnProperty(key)) {
                        outputs[key](value);
                    }
                });
            }
        };

        self.rerenderControls = function () {
            var allControls = self.controlsFromServer.concat(self.additionalControls);
            self.controls(self._processControls(allControls))
        };

        self.requestData = function () {
            OctoPrint.control.getCustomControls()
                .done(function(response) {
                    self._fromResponse(response);
                });
        };

        self._fromResponse = function (response) {
            self.controlsFromServer = response.controls;
            self.rerenderControls();
        };

        self._processControls = function (controls) {
            for (var i = 0; i < controls.length; i++) {
                controls[i] = self._processControl(controls[i]);
            }
            return controls;
        };

        self._processControl = function (control) {
            if (control.hasOwnProperty("processed") && control.processed) {
                return control;
            }

            if (control.hasOwnProperty("template") && control.hasOwnProperty("key") && control.hasOwnProperty("template_key") && !control.hasOwnProperty("output")) {
                control.output = ko.observable(control.default || "");
                if (!self.feedbackControlLookup.hasOwnProperty(control.key)) {
                    self.feedbackControlLookup[control.key] = {};
                }
                self.feedbackControlLookup[control.key][control.template_key] = control.output;
            }

            if (control.hasOwnProperty("children")) {
                control.children = ko.observableArray(self._processControls(control.children));
                if (!control.hasOwnProperty("layout") || !(control.layout == "vertical" || control.layout == "horizontal" || control.layout == "horizontal_grid")) {
                    control.layout = "vertical";
                }

                if (!control.hasOwnProperty("collapsed")) {
                    control.collapsed = false;
                }
            }

            if (control.hasOwnProperty("input")) {
                var attributeToInt = function(obj, key, def) {
                    if (obj.hasOwnProperty(key)) {
                        var val = obj[key];
                        if (_.isNumber(val)) {
                            return val;
                        }

                        var parsedVal = parseInt(val);
                        if (!isNaN(parsedVal)) {
                            return parsedVal;
                        }
                    }
                    return def;
                };

                _.each(control.input, function (element) {
                    if (element.hasOwnProperty("slider") && _.isObject(element.slider)) {
                        element.slider["min"] = attributeToInt(element.slider, "min", 0);
                        element.slider["max"] = attributeToInt(element.slider, "max", 255);

                        // try defaultValue, default to min
                        var defaultValue = attributeToInt(element, "default", element.slider.min);

                        // if default value is not within range of min and max, correct that
                        if (!_.inRange(defaultValue, element.slider.min, element.slider.max)) {
                            // use bound closer to configured default value
                            defaultValue = defaultValue < element.slider.min ? element.slider.min : element.slider.max;
                        }

                        element.value = ko.observable(defaultValue);
                    } else {
                        element.slider = false;
                        element.value = ko.observable((element.hasOwnProperty("default")) ? element["default"] : undefined);
                    }
                });
            }

            var js;
            if (control.hasOwnProperty("javascript")) {
                js = control.javascript;

                // if js is a function everything's fine already, but if it's a string we need to eval that first
                if (!_.isFunction(js)) {
                    control.javascript = function (data) {
                        eval(js);
                    };
                }
            }

            if (control.hasOwnProperty("enabled")) {
                js = control.enabled;

                // if js is a function everything's fine already, but if it's a string we need to eval that first
                if (!_.isFunction(js)) {
                    control.enabled = function (data) {
                        return eval(js);
                    }
                }
            }

            if (!control.hasOwnProperty("additionalClasses")) {
                control.additionalClasses = "";
            }

            control.processed = true;
            return control;
        };

        self.isCustomEnabled = function (data) {
            if (data.hasOwnProperty("enabled")) {
                return data.enabled(data);
            } else {
                return self.isOperational() && self.loginState.isUser();
            }
        };

        self.clickCustom = function (data) {
            var callback;
            if (data.hasOwnProperty("javascript")) {
                callback = data.javascript;
            } else {
                callback = self.sendCustomCommand;
            }

            if (data.confirm) {
                showConfirmationDialog({
                    message: data.confirm,
                    onproceed: function (e) {
                        callback(data);
                    }
                });
            } else {
                callback(data);
            }
        };

        self.sendJogCommand = function (axis, multiplier, distance) {
            if (typeof distance === "undefined")
                distance = self.distance();
            if (self.settings.printerProfiles.currentProfileData() && self.settings.printerProfiles.currentProfileData()["axes"] && self.settings.printerProfiles.currentProfileData()["axes"][axis] && self.settings.printerProfiles.currentProfileData()["axes"][axis]["inverted"]()) {
                multiplier *= -1;
            }

            var data = {};
            data[axis] = distance * multiplier;
            OctoPrint.printer.jog(data);
        };

        self.sendHomeCommand = function (axis) {
            OctoPrint.printer.home(axis);
        };

        self.sendFeedRateCommand = function () {
            OctoPrint.printer.setFeedrate(self.feedRate());
        };

        self.sendExtrudeCommand = function () {
            self._sendECommand(1);
        };

        self.sendRetractCommand = function () {
            self._sendECommand(-1);
        };

        self.sendFlowRateCommand = function () {
            OctoPrint.printer.setFlowrate(self.flowRate());
        };

        self._sendECommand = function (dir) {
            var length = self.extrusionAmount() || self.settings.printer_defaultExtrusionLength();
            OctoPrint.printer.extrude(length * dir);
        };

        self.sendSelectToolCommand = function (data) {
            if (!data || !data.key()) return;

            OctoPrint.printer.selectTool(data.key());
        };

        self.sendCustomCommand = function (command) {
            if (!command) return;

            var parameters = {};
            if (command.hasOwnProperty("input")) {
                _.each(command.input, function (input) {
                    if (!input.hasOwnProperty("parameter") || !input.hasOwnProperty("value")) {
                        return;
                    }

                    parameters[input.parameter] = input.value();
                });
            }

            if (command.hasOwnProperty("command") || command.hasOwnProperty("commands")) {
                var commands = command.commands || [command.command];
                OctoPrint.control.sendGcodeWithParameters(commands, parameters);
            } else if (command.hasOwnProperty("script")) {
                var script = command.script;
                var context = command.context || {};
                OctoPrint.control.sendGcodeScriptWithParameters(script, context, parameters);
            }
        };

        self.displayMode = function (customControl) {
            if (customControl.hasOwnProperty("children")) {
                if (customControl.name) {
                    return "customControls_containerTemplate_collapsable";
                } else {
                    return "customControls_containerTemplate_nameless";
                }
            } else {
                return "customControls_controlTemplate";
            }
        };

        self.rowCss = function (customControl) {
            var span = "span2";
            var offset = "";
            if (customControl.hasOwnProperty("width")) {
                span = "span" + customControl.width;
            }
            if (customControl.hasOwnProperty("offset")) {
                offset = "offset" + customControl.offset;
            }
            return span + " " + offset;
        };

        self.onStartup = function () {
            self.requestData();
        };

        self._disableWebcam = function() {
            // only disable webcam stream if tab is out of focus for more than 5s, otherwise we might cause
            // more load by the constant connection creation than by the actual webcam stream

            // safari bug doesn't release the mjpeg stream, so we just disable this for safari.
            if (OctoPrint.coreui.browser.safari) {
                return;
            }

            var timeout = self.settings.webcam_streamTimeout() || 5;
            self.webcamDisableTimeout = setTimeout(function () {
                log.debug("Unloading webcam stream");
                $("#webcam_image").attr("src", "");
                self.webcamLoaded(false);
            }, timeout * 1000);
        };

        self._enableWebcam = function() {
            if (OctoPrint.coreui.selectedTab != "#control" || !OctoPrint.coreui.browserTabVisible) {
                return;
            }

            if (self.webcamDisableTimeout != undefined) {
                clearTimeout(self.webcamDisableTimeout);
            }
            var webcamImage = $("#webcam_image");
            var currentSrc = webcamImage.attr("src");

            // safari bug doesn't release the mjpeg stream, so we just set it up the once
            if (OctoPrint.coreui.browser.safari && currentSrc != undefined) {
                return;
            }

            var newSrc = self.settings.webcam_streamUrl();
            if (currentSrc != newSrc) {
                if (newSrc.lastIndexOf("?") > -1) {
                    newSrc += "&";
                } else {
                    newSrc += "?";
                }
                newSrc += new Date().getTime();

                self.webcamLoaded(false);
                self.webcamError(false);
                webcamImage.attr("src", newSrc);
            }
        };

        self.onWebcamLoaded = function() {
            if (self.webcamLoaded()) return;

            log.debug("Webcam stream loaded");
            self.webcamLoaded(true);
            self.webcamError(false);
        };

        self.onWebcamErrored = function() {
            log.debug("Webcam stream failed to load/disabled");
            self.webcamLoaded(false);
            self.webcamError(true);
        };

        self.onTabChange = function (current, previous) {
            if (current == "#control") {
                self._enableWebcam();
            } else if (previous == "#control") {
                self._disableWebcam();
            }
        };

        self.onBrowserTabVisibilityChange = function(status) {
            if (status) {
                self._enableWebcam();
            } else {
                self._disableWebcam();
            }
        };

        self.onAllBound = function (allViewModels) {
            var additionalControls = [];
            callViewModels(allViewModels, "getAdditionalControls", function(method) {
                additionalControls = additionalControls.concat(method());
            });
            if (additionalControls.length > 0) {
                self.additionalControls = additionalControls;
                self.rerenderControls();
            }
            self._enableWebcam();
        };

        self.onFocus = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;
            self.keycontrolActive(true);
        };

        self.onMouseOver = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;
            $("#webcam_container").focus();
            self.keycontrolActive(true);
        };

        self.onMouseOut = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;
            $("#webcam_container").blur();
            self.keycontrolActive(false);
        };

        self.toggleKeycontrolHelp = function () {
            self.keycontrolHelpActive(!self.keycontrolHelpActive());
        };

        self.onKeyDown = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;

            var button = undefined;
            var visualizeClick = true;

            switch (event.which) {
                case 37: // left arrow key
                    // X-
                    button = $("#control-xdec");
                    break;
                case 38: // up arrow key
                    // Y+
                    button = $("#control-yinc");
                    break;
                case 39: // right arrow key
                    // X+
                    button = $("#control-xinc");
                    break;
                case 40: // down arrow key
                    // Y-
                    button = $("#control-ydec");
                    break;
                case 49: // number 1
                case 97: // numpad 1
                    // Distance 0.1
                    button = $("#control-distance01");
                    visualizeClick = false;
                    break;
                case 50: // number 2
                case 98: // numpad 2
                    // Distance 1
                    button = $("#control-distance1");
                    visualizeClick = false;
                    break;
                case 51: // number 3
                case 99: // numpad 3
                    // Distance 10
                    button = $("#control-distance10");
                    visualizeClick = false;
                    break;
                case 52: // number 4
                case 100: // numpad 4
                    // Distance 100
                    button = $("#control-distance100");
                    visualizeClick = false;
                    break;
                case 33: // page up key
                case 87: // w key
                    // z lift up
                    button = $("#control-zinc");
                    break;
                case 34: // page down key
                case 83: // s key
                    // z lift down
                    button = $("#control-zdec");
                    break;
                case 36: // home key
                    // xy home
                    button = $("#control-xyhome");
                    break;
                case 35: // end key
                    // z home
                    button = $("#control-zhome");
                    break;
                default:
                    event.preventDefault();
                    return false;
            }

            if (button === undefined) {
                return false;
            } else {
                event.preventDefault();
                if (visualizeClick) {
                    button.addClass("active");
                    setTimeout(function () {
                        button.removeClass("active");
                    }, 150);
                }
                button.click();
            }
        };

        self.stripDistanceDecimal = function(distance) {
            return distance.toString().replace(".", "");
        };

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: ControlViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#control"]
    });
});

;

// source: js/app/viewmodels/files.js
$(function() {
    function FilesViewModel(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];
        self.loginState = parameters[1];
        self.printerState = parameters[2];
        self.slicing = parameters[3];
        self.printerProfiles=parameters[4];

        self.filesListVisible = ko.observable(true);
        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);
        self.isSdReady = ko.observable(undefined);

        self.searchQuery = ko.observable(undefined);
        self.searchQuery.subscribe(function() {
            self.performSearch();
        });

        self.freeSpace = ko.observable(undefined);
        self.totalSpace = ko.observable(undefined);
        self.freeSpaceString = ko.pureComputed(function() {
            if (!self.freeSpace())
                return "-";
            return formatSize(self.freeSpace());
        });
        self.totalSpaceString = ko.pureComputed(function() {
            if (!self.totalSpace())
                return "-";
            return formatSize(self.totalSpace());
        });

        self.diskusageWarning = ko.pureComputed(function() {
            return self.freeSpace() !== undefined
                && self.freeSpace() < self.settingsViewModel.server_diskspace_warning();
        });
        self.diskusageCritical = ko.pureComputed(function() {
            return self.freeSpace() !== undefined
                && self.freeSpace() < self.settingsViewModel.server_diskspace_critical();
        });
        self.diskusageString = ko.pureComputed(function() {
            if (self.diskusageCritical()) {
                return gettext("Your available free disk space is critically low.");
            } else if (self.diskusageWarning()) {
                return gettext("Your available free disk space is starting to run low.");
            } else {
                return gettext("Your current disk usage.");
            }
        });

        self.uploadButton = undefined;
        self.uploadSdButton = undefined;
        self.uploadProgressBar = undefined;
        self.localTarget = undefined;
        self.sdTarget = undefined;

        self.dropOverlay = undefined;
        self.dropZone = undefined;
        self.dropZoneLocal = undefined;
        self.dropZoneSd = undefined;
        self.dropZoneBackground = undefined;
        self.dropZoneLocalBackground = undefined;
        self.dropZoneSdBackground = undefined;
        self.listElement = undefined;

        self.ignoreUpdatedFilesEvent = false;

        self.addingFolder = ko.observable(false);
        self.activeRemovals = ko.observableArray([]);

        self.addFolderDialog = undefined;
        self.addFolderName = ko.observable(undefined);
        self.enableAddFolder = ko.pureComputed(function() {
            return self.loginState.isUser() && self.addFolderName() && self.addFolderName().trim() !== ""
                && !self.addingFolder();
        });

        self.allItems = ko.observable(undefined);
        self.listStyle = ko.observable("folders_files");
        self.currentPath = ko.observable("");
        self.uploadProgressText = ko.observable();

        // initialize list helper
        self.listHelper = new ItemListHelper(
            "gcodeFiles",
            {
                "name": function(a, b) {
                    // sorts ascending
                    if (a["display"].toLowerCase() < b["display"].toLowerCase()) return -1;
                    if (a["display"].toLowerCase() > b["display"].toLowerCase()) return 1;
                    return 0;
                },
                "upload": function(a, b) {
                    // sorts descending
                    if (b["date"] === undefined || a["date"] > b["date"]) return -1;
                    if (a["date"] === undefined || a["date"] < b["date"]) return 1;
                    return 0;
                },
                "size": function(a, b) {
                    // sorts descending
                    if (b["size"] === undefined || a["size"] > b["size"]) return -1;
                    if (a["size"] === undefined || a["size"] < b["size"]) return 1;
                    return 0;
                }
            },
            {
                "printed": function(data) {
                    return !(data["prints"] && data["prints"]["success"] && data["prints"]["success"] > 0)
                        || (data["type"] && data["type"] === "folder");
                },
                "sd": function(data) {
                    return data["origin"] && data["origin"] === "sdcard";
                },
                "local": function(data) {
                    return !(data["origin"] && data["origin"] === "sdcard");
                },
                "machinecode": function(data) {
                    return data["type"] && (data["type"] === "machinecode" || data["type"] === "folder");
                },
                "model": function(data) {
                    return data["type"] && (data["type"] === "model" || data["type"] === "folder");
                }
            },
            "name",
            [],
            [["sd", "local"], ["machinecode", "model"]],
            0
        );

        self.foldersOnlyList = ko.dependentObservable(function() {
            var filter = function(data) { return data["type"] && data["type"] === "folder"; };
            return _.filter(self.listHelper.paginatedItems(), filter);
        });

        self.filesOnlyList = ko.dependentObservable(function() {
            var filter = function(data) { return data["type"] && data["type"] !== "folder"; };
            return _.filter(self.listHelper.paginatedItems(), filter);
        });

        self.filesAndFolders = ko.dependentObservable(function() {
            var style = self.listStyle();
            if (style === "folders_files" || style === "files_folders") {
                var files = self.filesOnlyList();
                var folders = self.foldersOnlyList();

                if (style === "folders_files") {
                    return folders.concat(files);
                } else {
                    return files.concat(folders);
                }
            } else {
                return self.listHelper.paginatedItems();
            }
        });

        self.isLoadActionPossible = ko.pureComputed(function() {
            return self.loginState.isUser() && !self.isPrinting() && !self.isPaused() && !self.isLoading();
        });

        self.isLoadAndPrintActionPossible = ko.pureComputed(function() {
            return self.loginState.isUser() && self.isOperational() && self.isLoadActionPossible();
        });

        self.printerState.filepath.subscribe(function(newValue) {
            self.highlightFilename(newValue);
        });

        self.highlightCurrentFilename = function() {
            self.highlightFilename(self.printerState.filepath());
        };

        self.highlightFilename = function(filename) {
            if (filename === undefined) {
                self.listHelper.selectNone();
            } else {
                self.listHelper.selectItem(function(item) {
                    if (item.type === "folder") {
                        return _.startsWith(filename, item.path + "/");
                    } else {
                        return item.path === filename;
                    }
                });
            }
        };

        self.fromCurrentData = function(data) {
            self._processStateData(data.state);
        };

        self.fromHistoryData = function(data) {
            self._processStateData(data.state);
        };

        self._processStateData = function(data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
            self.isSdReady(data.flags.sdReady);
        };

        self._otherRequestInProgress = undefined;
        self._focus = undefined;
        self._switchToPath = undefined;
        self.requestData = function(params) {
            var focus, switchToPath, force;

            if (_.isObject(params)) {
                focus = params.focus;
                switchToPath = params.switchToPath;
                force = params.force
            } else if (arguments.length) {
                // old argument list type call signature
                log.warn("FilesViewModel.requestData called with old argument list. That is deprecated, please use parameter object instead.");
                if (arguments.length >= 1) {
                    if (arguments.length >= 2) {
                        focus = {location: arguments[1], path: arguments[0]};
                    } else {
                        focus = {location: "local", path: arguments[0]};
                    }
                }
                if (arguments.length >= 3) {
                    switchToPath = arguments[2];
                }
                if (arguments.length >= 4) {
                    force = arguments[3];
                }
            }

            self._focus = self._focus || focus;
            self._switchToPath = self._switchToPath || switchToPath;

            if (self._otherRequestInProgress !== undefined) {
                return self._otherRequestInProgress
            }

            return self._otherRequestInProgress = OctoPrint.files.list(true, force)
                .done(function(response) {
                    self.fromResponse(response, {focus: self._focus, switchToPath: self._switchToPath});
                })
                .always(function() {
                    self._otherRequestInProgress = undefined;
                    self._focus = undefined;
                    self._switchToPath = undefined;
                });
        };

        self.fromResponse = function(response, params) {
            var focus = undefined;
            var switchToPath;

            if (_.isObject(params)) {
                focus = params.focus || undefined;
                switchToPath = params.switchToPath || undefined;
            } else if (arguments.length > 1) {
                log.warn("FilesViewModel.requestData called with old argument list. That is deprecated, please use parameter object instead.");
                if (arguments.length > 2) {
                    focus = {location: arguments[2], path: arguments[1]};
                } else {
                    focus = {location: "local", path: arguments[1]};
                }
                if (arguments.length > 3) {
                    switchToPath = arguments[3] || undefined;
                }
            }

            var files = response.files;

            self.allItems(files);

            // Sanity check file list - see #2572
            var nonrecursive = false;
            _.each(files, function(file) {
                if (file.type === "folder" && file.children === undefined) {
                    nonrecursive = true;
                }
            });
            if (nonrecursive) {
                log.error("At least one folder doesn't have a 'children' element defined. That means the file list request " +
                    "wasn't actually made with 'recursive=true' in the query.\n\n" +
                    "This can happen on wrong reverse proxy configs that " +
                    "swallow up query parameters, see https://github.com/foosel/OctoPrint/issues/2572");
            }

            if (!switchToPath) {
                var currentPath = self.currentPath();
                if (currentPath === undefined) {
                    self.listHelper.updateItems(files);
                    self.currentPath("");
                } else {
                    // if we have a current path, make sure we stay on it
                    self.changeFolderByPath(currentPath);
                }
            } else {
                self.changeFolderByPath(switchToPath);
            }

            if (focus) {
                // got a file to scroll to
                var entryElement = self.getEntryElement({path: focus.path, origin: focus.location});
                if (entryElement) {
                    // scroll to uploaded element
                    self.listElement.scrollTop(entryElement.offsetTop);

                    // highlight uploaded element
                    var element = $(entryElement);
                    element.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function(e) {
                        // remove highlight class again
                        element.removeClass("highlight");
                    });
                    element.addClass("highlight");
                }
            }

            if (response.free !== undefined) {
                self.freeSpace(response.free);
            }

            if (response.total !== undefined) {
                self.totalSpace(response.total);
            }

            self.highlightCurrentFilename();
        };

        self.changeFolder = function(data) {
            if (data.children === undefined) {
                log.error("Can't switch to folder '" + data.path + "', no children available");
                return;
            }

            self.currentPath(data.path);
            self.listHelper.updateItems(data.children);
            self.highlightCurrentFilename();
        };

        self.navigateUp = function() {
            var path = self.currentPath().split("/");
            path.pop();
            self.changeFolderByPath(path.join("/"));
        };

        self.changeFolderByPath = function(path) {
            var element = self.elementByPath(path);
            if (element) {
                self.currentPath(path);
                self.listHelper.updateItems(element.children);
            } else{
                self.currentPath("");
                self.listHelper.updateItems(self.allItems());
            }
            self.highlightCurrentFilename();
        };

        self.showAddFolderDialog = function() {
            if (self.addFolderDialog) {
                self.addFolderName("");
                self.addFolderDialog.modal("show");
            }
        };

        self.addFolder = function() {
            var name = self.addFolderName();

            // "local" only for now since we only support local and sdcard,
            // and sdcard doesn't support creating folders...
            var location = "local";

            self.ignoreUpdatedFilesEvent = true;
            self.addingFolder(true);
            OctoPrint.files.createFolder(location, name, self.currentPath())
                .done(function(data) {
                    self.requestData({
                        focus: {
                            path: data.folder.name,
                            location: data.folder.origin
                        }
                    })
                        .done(function() {
                            self.addFolderDialog.modal("hide");
                        })
                        .always(function() {
                            self.addingFolder(false);
                        });
                })
                .fail(function() {
                    self.addingFolder(false);
                })
                .always(function() {
                    self.ignoreUpdatedFilesEvent = false;
                });
        };

        self.removeFolder = function(folder, event) {
            if (!folder) {
                return;
            }

            if (folder.type !== "folder") {
                return;
            }

            if (folder.weight > 0) {
                // confirm recursive delete
                var options = {
                    message: _.sprintf(gettext("You are about to delete the folder \"%(folder)s\" which still contains files and/or sub folders."), {folder: folder.name}),
                    onproceed: function() {
                        self._removeEntry(folder, event);
                    }
                };
                showConfirmationDialog(options);
            } else {
                self._removeEntry(folder, event);
            }
        };

        self.loadFile = function(data, printAfterLoad) {
            if (!data) {
                return;
            }

            if (printAfterLoad && self.listHelper.isSelected(data) && self.enablePrint(data)) {
                // file was already selected, just start the print job
                OctoPrint.job.start();
            } else {
                // select file, start print job (if requested and within dimensions)
                var withinPrintDimensions = self.evaluatePrintDimensions(data, true);
                var print = printAfterLoad && withinPrintDimensions;

                OctoPrint.files.select(data.origin, data.path, print);
            }
        };

        self.removeFile = function(file, event) {
            if (!file) {
                return;
            }

            if (file.type === "folder") {
                return;
            }

            self._removeEntry(file, event);
        };

        self.sliceFile = function(file) {
            if (!file) {
                return;
            }

            self.slicing.show(file.origin, file.path, true, undefined, {display: file.display});
        };

        self.initSdCard = function() {
            OctoPrint.printer.initSd();
        };

        self.releaseSdCard = function() {
            OctoPrint.printer.releaseSd();
        };

        self.refreshSdFiles = function() {
            OctoPrint.printer.refreshSd();
        };

        self._removeEntry = function(entry, event) {
            self.activeRemovals.push(entry.origin + ":" + entry.path);
            var finishActiveRemoval = function() {
                self.activeRemovals(_.filter(self.activeRemovals(), function(e) {
                    return e !== entry.origin + ":" + entry.path;
                }));
            };

            var activateSpinner = function(){},
                finishSpinner = function(){};

            if (event) {
                var element = $(event.currentTarget);
                if (element.length) {
                    var icon = $("i.fa-trash-o", element);
                    if (icon.length) {
                        activateSpinner = function() {
                            icon.removeClass("fa-trash-o").addClass("fa-spinner fa-spin");
                        };
                        finishSpinner = function() {
                            icon.removeClass("fa-spinner fa-spin").addClass("fa-trash-o");
                        };
                    }
                }
            }

            activateSpinner();

            var deferred = $.Deferred();
            OctoPrint.files.delete(entry.origin, entry.path)
                .done(function() {
                    self.requestData()
                        .done(function() {
                            deferred.resolve();
                        })
                        .fail(function() {
                            deferred.reject();
                        });
                })
                .fail(function() {
                    deferred.reject();
                });

            return deferred.promise()
                .always(function() {
                    finishActiveRemoval();
                    finishSpinner();
                });
        };

        self.downloadLink = function(data) {
            if (data["refs"] && data["refs"]["download"]) {
                return data["refs"]["download"];
            } else {
                return false;
            }
        };

        self.lastTimePrinted = function(data) {
            if (data["prints"] && data["prints"]["last"] && data["prints"]["last"]["date"]) {
                return data["prints"]["last"]["date"];
            } else {
                return "-";
            }
        };

        self.getSuccessClass = function(data) {
            if (!data["prints"] || !data["prints"]["last"]) {
                return "";
            }
            return data["prints"]["last"]["success"] ? "text-success" : "text-error";
        };

        self.templateFor = function(data) {
            return "files_template_" + data.type;
        };

        self.getEntryId = function(data) {
            return "gcode_file_" + md5(data["origin"] + ":" + data["path"]);
        };

        self.getEntryElement = function(data) {
            var entryId = self.getEntryId(data);
            var entryElements = $("#" + entryId);
            if (entryElements && entryElements[0]) {
                return entryElements[0];
            } else {
                return undefined;
            }
        };

        self.enableRemove = function(data) {
            if (_.contains(self.activeRemovals(), data.origin + ":" + data.path)) {
                return false;
            }

            var busy = false;
            if (data.type === "folder") {
                busy = _.any(self.printerState.busyFiles(), function(name) {
                    return _.startsWith(name, data.origin + ":" + data.path + "/");
                });
            } else {
                busy = _.contains(self.printerState.busyFiles(), data.origin + ":" + data.path);
            }
            return self.loginState.isUser() && !busy;
        };

        self.enableSelect = function(data, printAfterSelect) {
            return self.enablePrint(data) && !self.listHelper.isSelected(data);
        };

        self.enablePrint = function(data) {
            return self.loginState.isUser() && self.isOperational() && !(self.isPrinting() || self.isPaused() || self.isLoading());
        };

        self.enableSlicing = function(data) {
            return self.loginState.isUser() && self.slicing.enableSlicingDialog() && self.slicing.enableSlicingDialogForFile(data.name);
        };

        self.enableAdditionalData = function(data) {
            return data["gcodeAnalysis"] || data["prints"] && data["prints"]["last"];
        };

        self.toggleAdditionalData = function(data) {
            var entryElement = self.getEntryElement(data);
            if (!entryElement) return;

            var additionalInfo = $(".additionalInfo", entryElement);
            additionalInfo.slideToggle("fast", function() {
                $(".toggleAdditionalData i", entryElement).toggleClass("fa-chevron-down fa-chevron-up");
            });
        };

        self.getAdditionalData = function(data) {
            var output = "";
            if (data["gcodeAnalysis"]) {
                if (data["gcodeAnalysis"]["dimensions"]) {
                    var dimensions = data["gcodeAnalysis"]["dimensions"];
                    output += gettext("Model size") + ": " + _.sprintf("%(width).2fmm &times; %(depth).2fmm &times; %(height).2fmm", dimensions);
                    output += "<br>";
                }
                if (data["gcodeAnalysis"]["filament"] && typeof(data["gcodeAnalysis"]["filament"]) === "object") {
                    var filament = data["gcodeAnalysis"]["filament"];
                    if (_.keys(filament).length === 1) {
                        output += gettext("Filament") + ": " + formatFilament(data["gcodeAnalysis"]["filament"]["tool" + 0]) + "<br>";
                    } else if (_.keys(filament).length > 1) {
                        _.each(filament, function(f, k) {
                            if (!_.startsWith(k, "tool") || !f || !f.hasOwnProperty("length") || f["length"] <= 0) return;
                            output += gettext("Filament") + " (" + gettext("Tool") + " " + k.substr("tool".length)
                                + "): " + formatFilament(f) + "<br>";
                        });
                    }
                }
                output += gettext("Estimated print time") + ": " + formatFuzzyPrintTime(data["gcodeAnalysis"]["estimatedPrintTime"]) + "<br>";
            }
            if (data["prints"] && data["prints"]["last"]) {
                output += gettext("Last printed") + ": " + formatTimeAgo(data["prints"]["last"]["date"]) + "<br>";
                if (data["prints"]["last"]["printTime"]) {
                    output += gettext("Last print time") + ": " + formatDuration(data["prints"]["last"]["printTime"]);
                }
            }
            return output;
        };

        self.evaluatePrintDimensions = function(data, notify) {
            if (!self.settingsViewModel.feature_modelSizeDetection()) {
                return true;
            }

            var analysis = data["gcodeAnalysis"];
            if (!analysis) {
                return true;
            }

            var printingArea = data["gcodeAnalysis"]["printingArea"];
            if (!printingArea) {
                return true;
            }

            var printerProfile = self.printerProfiles.currentProfileData();
            if (!printerProfile) {
                return true;
            }

            var volumeInfo = printerProfile.volume;
            if (!volumeInfo) {
                return true;
            }

            // set print volume boundaries
            var boundaries;
            if (_.isPlainObject(volumeInfo.custom_box)) {
                boundaries = {
                    minX : volumeInfo.custom_box.x_min(),
                    minY : volumeInfo.custom_box.y_min(),
                    minZ : volumeInfo.custom_box.z_min(),
                    maxX : volumeInfo.custom_box.x_max(),
                    maxY : volumeInfo.custom_box.y_max(),
                    maxZ : volumeInfo.custom_box.z_max()
                }
            } else {
                boundaries = {
                    minX : 0,
                    maxX : volumeInfo.width(),
                    minY : 0,
                    maxY : volumeInfo.depth(),
                    minZ : 0,
                    maxZ : volumeInfo.height()
                };
                if (volumeInfo.origin() === "center") {
                    boundaries["maxX"] = volumeInfo.width() / 2;
                    boundaries["minX"] = -1 * boundaries["maxX"];
                    boundaries["maxY"] = volumeInfo.depth() / 2;
                    boundaries["minY"] = -1 * boundaries["maxY"];
                }
            }

            // model not within bounds, we need to prepare a warning
            var warning = "<p>" + _.sprintf(gettext("Object in %(name)s exceeds the print volume of the currently selected printer profile, be careful when printing this."), data) + "</p>";
            var info = "";

            var formatData = {
                profile: boundaries,
                object: printingArea
            };

            // find exceeded dimensions
            if (printingArea["minX"] < boundaries["minX"] || printingArea["maxX"] > boundaries["maxX"]) {
                info += gettext("Object exceeds print volume in width.<br>");
            }
            if (printingArea["minY"] < boundaries["minY"] || printingArea["maxY"] > boundaries["maxY"]) {
                info += gettext("Object exceeds print volume in depth.<br>");
            }
            if (printingArea["minZ"] < boundaries["minZ"] || printingArea["maxZ"] > boundaries["maxZ"]) {
                info += gettext("Object exceeds print volume in height.<br>");
            }

            //warn user
            if (info !== "") {
                if (notify) {
                    info += _.sprintf(gettext("Object's bounding box: (%(object.minX).2f, %(object.minY).2f, %(object.minZ).2f) &times; (%(object.maxX).2f, %(object.maxY).2f, %(object.maxZ).2f)"), formatData);
                    info += "<br>";
                    info += _.sprintf(gettext("Print volume: (%(profile.minX).2f, %(profile.minY).2f, %(profile.minZ).2f) &times; (%(profile.maxX).2f, %(profile.maxY).2f, %(profile.maxZ).2f)"), formatData);

                    warning += pnotifyAdditionalInfo(info);

                    warning += "<p><small>You can disable this check via Settings &gt; Features &gt; \"Enable model size detection [...]\"</small></p>";

                    new PNotify({
                        title: gettext("Object doesn't fit print volume"),
                        text: warning,
                        type: "warning",
                        hide: false
                    });
                }
                return false;
            } else {
                return true;
            }
        };

        self.performSearch = function(e) {
            var query = self.searchQuery();
            if (query !== undefined && query.trim() !== "") {
                query = query.toLocaleLowerCase();

                var recursiveSearch = function(entry) {
                    if (entry === undefined) {
                        return false;
                    }

                    var success = entry["name"].toLocaleLowerCase().indexOf(query) > -1;
                    if (!success && entry["type"] === "folder" && entry["children"]) {
                        return _.any(entry["children"], recursiveSearch);
                    }

                    return success;
                };

                self.listHelper.changeSearchFunction(recursiveSearch);
            } else {
                self.listHelper.resetSearch();
            }

            return false;
        };

        self.elementByPath = function(path, root) {
            root = root || {children: self.allItems()};

            var recursiveSearch = function(location, element) {
                if (location.length === 0) {
                    return element;
                }

                if (!element.hasOwnProperty("children")) {
                    return undefined;
                }

                var name = location.shift();
                for (var i = 0; i < element.children.length; i++) {
                    if (name === element.children[i].name) {
                        return recursiveSearch(location, element.children[i]);
                    }
                }

                return undefined;
            };

            return recursiveSearch(path.split("/"), root);
        };

        self.onUserLoggedIn = function(user) {
            self.uploadButton.fileupload("enable");
            if (self.uploadSdButton) {
                self.uploadSdButton.fileupload("enable");
            }
        };

        self.onUserLoggedOut = function() {
            self.uploadButton.fileupload("disable");
            if (self.uploadSdButton) {
                self.uploadSdButton.fileupload("disable");
            }
        };

        self.onStartup = function() {
            $(".accordion-toggle[data-target='#files']").click(function() {
                var files = $("#files");
                if (files.hasClass("in")) {
                    files.removeClass("overflow_visible");
                    self.filesListVisible(false);
                } else {
                    setTimeout(function() {
                        files.addClass("overflow_visible");
                        self.filesListVisible(true);
                    }, 100);
                }
            });

            self.listElement = $("#files").find(".scroll-wrapper");

            self.addFolderDialog = $("#add_folder_dialog");
            self.addFolderDialog.on("shown", function() {
                $("input", self.addFolderDialog).focus();
            });
            $("form", self.addFolderDialog).on("submit", function(e) {
                e.preventDefault();
                if (self.enableAddFolder()) {
                    self.addFolder();
                }
            });

            //~~ Gcode upload

            self.uploadButton = $("#gcode_upload");
            self.uploadSdButton = $("#gcode_upload_sd");
            if (!self.uploadSdButton.length) {
                self.uploadSdButton = undefined;
            }

            self.uploadProgress = $("#gcode_upload_progress");
            self.uploadProgressBar = $(".bar", self.uploadProgress);

            self.dropOverlay = $("#drop_overlay");
            self.dropZone = $("#drop");
            self.dropZoneLocal = $("#drop_locally");
            self.dropZoneSd = $("#drop_sd");
            self.dropZoneBackground = $("#drop_background");
            self.dropZoneLocalBackground = $("#drop_locally_background");
            self.dropZoneSdBackground = $("#drop_sd_background");

            if (CONFIG_SD_SUPPORT) {
                self.localTarget = self.dropZoneLocal;
            } else {
                self.localTarget = self.dropZone;
                self.listHelper.removeFilter('sd');
            }
            self.sdTarget = self.dropZoneSd;

            self.dropOverlay.on('drop', self._forceEndDragNDrop);

            function evaluateDropzones() {
                var enableLocal = self.loginState.isUser();
                var enableSd = enableLocal && CONFIG_SD_SUPPORT && self.printerState.isSdReady() && !self.isPrinting();

                self._setDropzone("local", enableLocal);
                self._setDropzone("sdcard", enableSd);
            }
            self.loginState.isUser.subscribe(evaluateDropzones);
            self.printerState.isSdReady.subscribe(evaluateDropzones);
            self.isPrinting.subscribe(evaluateDropzones);
            evaluateDropzones();

            self.requestData();
        };

        self.onEventUpdatedFiles = function(payload) {
            if (self.ignoreUpdatedFilesEvent) {
                return;
            }

            if (payload.type !== "gcode") {
                return;
            }

            self.requestData();
        };

        self.onEventSlicingStarted = function(payload) {
            self.uploadProgress
                .addClass("progress-striped")
                .addClass("active");
            self.uploadProgressBar.css("width", "100%");
            if (payload.progressAvailable) {
                self.uploadProgressText(_.sprintf(gettext("Slicing ... (%(percentage)d%%)"), {percentage: 0}));
            } else {
                self.uploadProgressText(gettext("Slicing ..."));
            }
        };

        self.onSlicingProgress = function(slicer, modelPath, machinecodePath, progress) {
            self.uploadProgressText(_.sprintf(gettext("Slicing ... (%(percentage)d%%)"), {percentage: Math.round(progress)}));
        };

        self.onEventSlicingCancelled = function(payload) {
            self.uploadProgress
                .removeClass("progress-striped")
                .removeClass("active");
            self.uploadProgressBar
                .css("width", "0%");
            self.uploadProgressText("");
        };

        self.onEventSlicingDone = function(payload) {
            self.uploadProgress
                .removeClass("progress-striped")
                .removeClass("active");
            self.uploadProgressBar
                .css("width", "0%");
            self.uploadProgressText("");

            new PNotify({
                title: gettext("Slicing done"),
                text: _.sprintf(gettext("Sliced %(stl)s to %(gcode)s, took %(time).2f seconds"), payload),
                type: "success"
            });

            self.requestData();
        };

        self.onEventSlicingFailed = function(payload) {
            self.uploadProgress
                .removeClass("progress-striped")
                .removeClass("active");
            self.uploadProgressBar
                .css("width", "0%");
            self.uploadProgressText("");

            var html = _.sprintf(gettext("Could not slice %(stl)s to %(gcode)s: %(reason)s"), payload);
            new PNotify({title: gettext("Slicing failed"), text: html, type: "error", hide: false});
        };

        self.onEventMetadataAnalysisFinished = function(payload) {
            self.requestData();
        };

        self.onEventMetadataStatisticsUpdated = function(payload) {
            self.requestData();
        };

        self.onEventTransferStarted = function(payload) {
            self.uploadProgress
                .addClass("progress-striped")
                .addClass("active");
            self.uploadProgressBar
                .css("width", "100%");
            self.uploadProgressText(gettext("Streaming ..."));
        };

        self.onEventTransferDone = function(payload) {
            self.uploadProgress
                .removeClass("progress-striped")
                .removeClass("active");
            self.uploadProgressBar
                .css("width", "0");
            self.uploadProgressText("");

            new PNotify({
                title: gettext("Streaming done"),
                text: _.sprintf(gettext("Streamed %(local)s to %(remote)s on SD, took %(time).2f seconds"), payload),
                type: "success"
            });

            self.requestData({focus: {location: "sdcard", path: payload.remote}});
        };

        self.onEventTransferFailed = function(payload) {
            self.uploadProgress
                .removeClass("progress-striped")
                .removeClass("active");
            self.uploadProgressBar
                .css("width", "0");
            self.uploadProgressText("");

            new PNotify({
                title: gettext("Streaming failed"),
                text: _.sprintf(gettext("Did not finish streaming %(local)s to %(remote)s on SD"), payload),
                type: "error"
            });

            self.requestData();
        };

        self.onServerConnect = self.onServerReconnect = function(payload) {
            self._enableDragNDrop(true);
            self.requestData();
        };

        self.onServerDisconnect = function(payload) {
            self._enableDragNDrop(false);
        };

        self._setDropzone = function(dropzone, enable) {
            var button = (dropzone === "local") ? self.uploadButton : self.uploadSdButton;
            var drop = (dropzone === "local") ? self.localTarget : self.sdTarget;
            var url = API_BASEURL + "files/" + dropzone;

            if (button === undefined)
                return;

            button.fileupload({
                url: url,
                dataType: "json",
                dropZone: enable ? drop : null,
                drop: function(e, data) {

                },
                submit: self._handleUploadStart,
                done: self._handleUploadDone,
                fail: self._handleUploadFail,
                always: self._handleUploadAlways,
                progressall: self._handleUploadProgress
            }).bind('fileuploadsubmit', function(e, data) {
                if (self.currentPath() !== "")
                    data.formData = { path: self.currentPath() };
            });
        };

        self._enableDragNDrop = function(enable) {
            if (enable) {
                $(document).bind("dragenter", self._handleDragEnter);
                $(document).bind("dragleave", self._handleDragLeave);
                $(document).bind("dragover", self._handleDragOver);
                log.debug("Enabled drag-n-drop");
            } else {
                $(document).unbind("dragenter", self._handleDragEnter);
                $(document).unbind("dragleave", self._handleDragLeave);
                $(document).unbind("dragover", self._handleDragOver);
                log.debug("Disabled drag-n-drop");
            }
        };

        self._setProgressBar = function(percentage, text, active) {
            self.uploadProgressBar
                .css("width", percentage + "%");
            self.uploadProgressText(text);

            if (active) {
                self.uploadProgress
                    .addClass("progress-striped active");
            } else {
                self.uploadProgress
                    .removeClass("progress-striped active");
            }
        };

        self._handleUploadStart = function(e, data) {
            self.ignoreUpdatedFilesEvent = true;
            return true;
        };

        self._handleUploadDone = function(e, data) {
            var focus = undefined;
            if (data.result.files.hasOwnProperty("sdcard")) {
                focus = {location: "sdcard", path: data.result.files.sdcard.path};
            } else if (data.result.files.hasOwnProperty("local")) {
                focus = {location: "local", path: data.result.files.local.path};
            }
            self.requestData({focus: focus})
                .done(function() {
                    if (data.result.done) {
                        self._setProgressBar(0, "", false);
                    }
                });

            if (focus && _.endsWith(focus.path.toLowerCase(), ".stl")) {
                self.slicing.show(focus.location, focus.path);
            }
        };

        self._handleUploadFail = function(e, data) {
            var extensions = _.map(SUPPORTED_EXTENSIONS, function(extension) {
                return extension.toLowerCase();
            }).sort();
            extensions = extensions.join(", ");
            var error = "<p>"
                + _.sprintf(gettext("Could not upload the file. Make sure that it is a valid file with one of these extensions: %(extensions)s"),
                            {extensions: extensions})
                + "</p>";
            error += pnotifyAdditionalInfo("<pre>" + data.jqXHR.responseText + "</pre>");
            new PNotify({
                title: "Upload failed",
                text: error,
                type: "error",
                hide: false
            });
            self._setProgressBar(0, "", false);
        };

        self._handleUploadAlways = function(e, data) {
            self.ignoreUpdatedFilesEvent = false;
        };

        self._handleUploadProgress = function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            var uploaded = progress >= 100;

            self._setProgressBar(progress, uploaded ? gettext("Saving ...") : gettext("Uploading ..."), uploaded);
        };

        self._dragNDropTarget = null;
        self._dragNDropFFTimeout = undefined;
        self._dragNDropFFTimeoutDelay = 100;
        self._forceEndDragNDrop = function () {
            self.dropOverlay.removeClass("in");
            if (self.dropZoneLocal) self.dropZoneLocalBackground.removeClass("hover");
            if (self.dropZoneSd) self.dropZoneSdBackground.removeClass("hover");
            if (self.dropZone) self.dropZoneBackground.removeClass("hover");
            self._dragNDropTarget = null;
        };

        self._handleDragLeave = function (e) {
            if (e.target !== self._dragNDropTarget) return;
            self._forceEndDragNDrop();
        };

        self._handleDragOver = function(e) {
            // Workaround for Firefox
            //
            // Due to a browser bug (https://bugzilla.mozilla.org/show_bug.cgi?id=656164),
            // if you drag a file out of the window no drag leave event will be fired. So on Firefox we check if
            // our last dragover event was within a timeout. If not, we assume that's because the mouse
            // cursor left the browser window and force a drag stop.
            //
            // Since Firefox keeps on triggering dragover events even if the mouse is not moved while over the
            // browser window, this should work without side effects (e.g. the overlay should stay even if the user
            // keeps the mouse perfectly still).
            //
            // See #2166
            if (!OctoPrint.coreui.browser.firefox) return;
            if (e.target !== self._dragNDropTarget) return;

            if (self._dragNDropFFTimeout !== undefined) {
                window.clearTimeout(self._dragNDropFFTimeout);
                self._dragNDropFFTimeout = undefined;
            }

            self._dragNDropFFTimeout = window.setTimeout(function() {
                self._forceEndDragNDrop();
                self._dragNDropFFTimeout = undefined;
            }, self._dragNDropFFTimeoutDelay);
        };

        self._handleDragEnter = function (e) {
            self.dropOverlay.addClass('in');

            var foundLocal = false;
            var foundSd = false;
            var found = false;
            var node = e.target;
            do {
                if (self.dropZoneLocal && node === self.dropZoneLocal[0]) {
                    foundLocal = true;
                    break;
                } else if (self.dropZoneSd && node === self.dropZoneSd[0]) {
                    foundSd = true;
                    break;
                } else if (self.dropZone && node === self.dropZone[0]) {
                    found = true;
                    break;
                }
                node = node.parentNode;
            } while (node !== null);

            if (foundLocal) {
                self.dropZoneLocalBackground.addClass("hover");
                self.dropZoneSdBackground.removeClass("hover");
            } else if (foundSd && self.printerState.isSdReady() && !self.isPrinting()) {
                self.dropZoneSdBackground.addClass("hover");
                self.dropZoneLocalBackground.removeClass("hover");
            } else if (found) {
                self.dropZoneBackground.addClass("hover");
            } else {
                if (self.dropZoneLocalBackground) self.dropZoneLocalBackground.removeClass("hover");
                if (self.dropZoneSdBackground) self.dropZoneSdBackground.removeClass("hover");
                if (self.dropZoneBackground) self.dropZoneBackground.removeClass("hover");
            }
            self._dragNDropTarget = e.target;
            self._dragNDropLastOver = Date.now();
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: FilesViewModel,
        name: "filesViewModel",
        additionalNames: ["gcodeFilesViewModel"],
        dependencies: ["settingsViewModel", "loginStateViewModel", "printerStateViewModel", "slicingViewModel", "printerProfilesViewModel"],
        elements: ["#files_wrapper", "#add_folder_dialog"]
    });
});

;

// source: js/app/viewmodels/loginstate.js
$(function() {
    function LoginStateViewModel() {
        var self = this;

        self.loginUser = ko.observable("");
        self.loginPass = ko.observable("");
        self.loginRemember = ko.observable(false);

        self.loggedIn = ko.observable(false);
        self.username = ko.observable(undefined);
        self.isAdmin = ko.observable(false);
        self.isUser = ko.observable(false);

        self.allViewModels = undefined;
        self.startupDeferred = $.Deferred();

        self.currentUser = ko.observable(undefined);

        self.elementUsernameInput = undefined;
        self.elementPasswordInput = undefined;
        self.elementLoginButton = undefined;

        self.externalAddressNotification = undefined;

        self.userMenuText = ko.pureComputed(function() {
            if (self.loggedIn()) {
                return self.username();
            } else {
                return gettext("Login");
            }
        });

        self.userMenuTitle = ko.pureComputed(function() {
            if (self.loggedIn()) {
                return _.sprintf(gettext("Logged in as %(name)s"), {name: self.username()});
            } else {
                return gettext("Login");
            }
        });

        self.reloadUser = function() {
            if (self.currentUser() === undefined) {
                return;
            }

            return OctoPrint.users.get(self.currentUser().name)
                .done(self.updateCurrentUserData);
        };

        self.requestData = function() {
            return OctoPrint.browser.passiveLogin()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            var process = function() {
                var currentLoggedIn = self.loggedIn();
                if (response && response.name) {
                    self.loggedIn(true);
                    self.updateCurrentUserData(response);
                    if (!currentLoggedIn) {
                        callViewModels(self.allViewModels, "onUserLoggedIn", [response]);
                        log.info("User " + response.name + " logged in")
                    }

                    if (response.session) {
                        OctoPrint.socket.sendAuth(response.name, response.session);
                    }

                    // Show warning if connecting from what seems to be an external IP address, unless ignored
                    var ignorePublicAddressWarning = localStorage["loginState.ignorePublicAddressWarning"];
                    if (ignorePublicAddressWarning === undefined) {
                        ignorePublicAddressWarning = false;
                    } else {
                        ignorePublicAddressWarning = JSON.parse(ignorePublicAddressWarning);
                    }

                    if (response._is_external_client && !ignorePublicAddressWarning) {
                        var text = gettext("<p>It seems that you are connecting to OctoPrint over the public internet.</p>" +
                            "<p>This is strongly discouraged unless you have taken proper network security precautions. " +
                            "Your printer is an appliance you really should not be giving access to " +
                            "everyone with an internet connection.</p><p><strong>Please see " +
                            "<a href=\"%(url)s\" target=\"_blank\" rel=\"noreferrer noopener\">this blog post</a> for " +
                            "ways to safely access your OctoPrint instance from remote.</strong></p>" +
                            "<p><small>If you know what you are doing or you are sure this message is " +
                            "mistaken since you are in an isolated LAN, feel free to ignore it.</small></p>");
                        text = _.sprintf(text, {url: "https://octoprint.org/blog/2018/09/03/safe-remote-access/"});

                        if (self.externalAddressNotification !== undefined) {
                            self.externalAddressNotification.remove();
                        }

                        self.externalAddressNotification = new PNotify({
                            title: gettext("Possible external access detected"),
                            text: text,
                            hide: false,
                            type: "error",
                            confirm: {
                                confirm: true,
                                buttons: [{
                                    text: gettext("Ignore"),
                                    addClass: "btn btn-danger",
                                    click: function(notice) {
                                        notice.remove();
                                        localStorage["loginState.ignorePublicAddressWarning"] = JSON.stringify(true);
                                    }
                                }, {
                                    text: gettext("Later"),
                                    addClass: "btn btn-primary",
                                    click: function(notice) {
                                        notice.remove();
                                    }
                                }]
                            },
                            buttons: {
                                sticker: false
                            }

                        })
                    }
                } else {
                    self.loggedIn(false);
                    self.resetCurrentUserData();
                    if (currentLoggedIn) {
                        callViewModels(self.allViewModels, "onUserLoggedOut");
                        log.info("User logged out");
                    }
                }
            };

            if (self.startupDeferred !== undefined) {
                // Make sure we only fire our "onUserLogged(In|Out)" message after the application
                // has started up.
                self.startupDeferred.done(process);
            } else {
                process();
            }
        };

        self.updateCurrentUserData = function(data) {
            self.username(data.name);
            self.isUser(data.user);
            self.isAdmin(data.admin);

            self.currentUser(data);
        };

        self.resetCurrentUserData = function() {
            self.username(undefined);
            self.isUser(false);
            self.isAdmin(false);

            self.currentUser(undefined);
        };

        self.login = function(u, p, r) {
            var username = u || self.loginUser();
            var password = p || self.loginPass();
            var remember = (r != undefined ? r : self.loginRemember());

            return OctoPrint.browser.login(username, password, remember)
                .done(function(response) {
                    new PNotify({title: gettext("Login successful"), text: _.sprintf(gettext('You are now logged in as "%(username)s"'), {username: response.name}), type: "success"});
                    self.fromResponse(response);

                    self.loginUser("");
                    self.loginPass("");
                    self.loginRemember(false);

                    if (history && history.replaceState) {
                        history.replaceState({success: true}, document.title, window.location.pathname);
                    }
                })
                .fail(function(response) {
                    switch(response.status) {
                        case 401: {
                            new PNotify({
                                title: gettext("Login failed"),
                                text: gettext("User unknown or wrong password"),
                                type: "error"
                            });
                            break;
                        }
                        case 403: {
                            new PNotify({
                                title: gettext("Login failed"),
                                text: gettext("Your account is deactivated"),
                                type: "error"
                            });
                            break;
                        }
                    }
                });
        };

        self.logout = function() {
            return OctoPrint.browser.logout()
                .done(function(response) {
                    new PNotify({title: gettext("Logout successful"), text: gettext("You are now logged out"), type: "success"});
                    self.fromResponse(response);
                })
                .fail(function(error) {
                    if (error && error.status === 401) {
                         self.fromResponse(false);
                    }
                });
        };

        self.prepareLogin = function(data, event) {
            if(event && event.preventDefault) {
                event.preventDefault();
            }
            self.login();
        };

        self.onDataUpdaterReauthRequired = function(reason) {
            if (reason === "logout" || reason === "removed") {
                self.logout();
            } else {
                self.requestData();
            }
        };

        self.onAllBound = function(allViewModels) {
            self.allViewModels = allViewModels;
            self.startupDeferred.resolve();
            self.startupDeferred = undefined;
        };

        self.onStartup = function() {
            self.elementUsernameInput = $("#login_user");
            self.elementPasswordInput = $("#login_pass");
            self.elementLoginButton = $("#login_button");

            var toggle = $("li.dropdown#navbar_login");
            var button = $("a", toggle);

            button.on("click", function(e) {
                $(this).parent().toggleClass("open");
            });

            $("body").on("click", function(e) {
                if (!toggle.hasClass("open")) {
                    return;
                }

                var anyFormLinkOrButton = $("#login_dropdown_loggedout a, #login_dropdown_loggedin a, #login_dropdown_loggedout button, #login_dropdown_loggedin button");
                var dropdown = $("li.dropdown#navbar_login");
                var anyLastpassButton = $("#__lpform_login_user, #__lpform_login_pass");

                var isLinkOrButton = anyFormLinkOrButton.is(e.target) || anyFormLinkOrButton.has(e.target).length !== 0;
                var isDropdown = dropdown.is(e.target) || dropdown.has(e.target).length !== 0;
                var isLastpass = anyLastpassButton.is(e.target) || anyLastpassButton.has(e.target).length !== 0;

                if (isLinkOrButton || !(isDropdown || isLastpass)) {
                    toggle.removeClass("open");
                }
            });

            if (self.elementUsernameInput && self.elementUsernameInput.length
                && self.elementLoginButton && self.elementLoginButton.length) {
                self.elementLoginButton.blur(function() {
                    self.elementUsernameInput.focus();
                })
            }
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: LoginStateViewModel
    });
});

;

// source: js/app/viewmodels/navigation.js
$(function() {
    function NavigationViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.appearance = parameters[1];
        self.settings = parameters[2];
        self.usersettings = parameters[3];
        self.system = parameters[4];

        self.appearanceClasses = ko.pureComputed(function() {
            var classes = self.appearance.color();
            if (self.appearance.colorTransparent()) {
                classes += " transparent";
            }
            return classes;
        });

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: NavigationViewModel,
        dependencies: ["loginStateViewModel", "appearanceViewModel", "settingsViewModel", "userSettingsViewModel", "systemViewModel"],
        elements: ["#navbar"]
    });
});

;

// source: js/app/viewmodels/printerstate.js
$(function() {
    function PrinterStateViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];

        self.stateString = ko.observable(undefined);
        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isCancelling = ko.observable(undefined);
        self.isPausing = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);
        self.isSdReady = ko.observable(undefined);

        self.enablePrint = ko.pureComputed(function() {
            return self.isOperational() && self.isReady() && !self.isPrinting() && !self.isCancelling() && !self.isPausing() && self.loginState.isUser() && self.filename();
        });
        self.enablePause = ko.pureComputed(function() {
            return self.isOperational() && (self.isPrinting() || self.isPaused()) && !self.isCancelling() && !self.isPausing() && self.loginState.isUser();
        });
        self.enableCancel = ko.pureComputed(function() {
            return self.isOperational() && (self.isPrinting() || self.isPaused()) && !self.isCancelling() && !self.isPausing() && self.loginState.isUser();
        });

        self.filename = ko.observable(undefined);
        self.filepath = ko.observable(undefined);
        self.filedisplay = ko.observable(undefined);
        self.progress = ko.observable(undefined);
        self.filesize = ko.observable(undefined);
        self.filepos = ko.observable(undefined);
        self.printTime = ko.observable(undefined);
        self.printTimeLeft = ko.observable(undefined);
        self.printTimeLeftOrigin = ko.observable(undefined);
        self.sd = ko.observable(undefined);
        self.timelapse = ko.observable(undefined);
        self.user = ko.observable(undefined);

        self.busyFiles = ko.observableArray([]);

        self.filament = ko.observableArray([]);
        self.estimatedPrintTime = ko.observable(undefined);
        self.lastPrintTime = ko.observable(undefined);

        self.currentHeight = ko.observable(undefined);

        self.TITLE_PRINT_BUTTON_PAUSED = gettext("Restarts the print job from the beginning");
        self.TITLE_PRINT_BUTTON_UNPAUSED = gettext("Starts the print job");
        self.TITLE_PAUSE_BUTTON_PAUSED = gettext("Resumes the print job");
        self.TITLE_PAUSE_BUTTON_UNPAUSED = gettext("Pauses the print job");

        self.titlePrintButton = ko.observable(self.TITLE_PRINT_BUTTON_UNPAUSED);
        self.titlePauseButton = ko.observable(self.TITLE_PAUSE_BUTTON_UNPAUSED);

        self.estimatedPrintTimeString = ko.pureComputed(function() {
            if (self.lastPrintTime())
                return formatFuzzyPrintTime(self.lastPrintTime());
            if (self.estimatedPrintTime())
                return formatFuzzyPrintTime(self.estimatedPrintTime());
            return "-";
        });
        self.byteString = ko.pureComputed(function() {
            if (!self.filesize())
                return "-";
            var filepos = self.filepos() ? formatSize(self.filepos()) : "-";
            return filepos + " / " + formatSize(self.filesize());
        });
        self.heightString = ko.pureComputed(function() {
            if (!self.currentHeight())
                return "-";
            return _.sprintf("%.02fmm", self.currentHeight());
        });
        self.printTimeString = ko.pureComputed(function() {
            if (!self.printTime())
                return "-";
            return formatDuration(self.printTime());
        });
        self.printTimeLeftString = ko.pureComputed(function() {
            if (self.printTimeLeft() == undefined) {
                if (!self.printTime() || !(self.isPrinting() || self.isPaused())) {
                    return "-";
                } else {
                    return gettext("Still stabilizing...");
                }
            } else {
                return formatFuzzyPrintTime(self.printTimeLeft());
            }
        });
        self.printTimeLeftOriginString = ko.pureComputed(function() {
            var value = self.printTimeLeftOrigin();
            switch (value) {
                case "linear": {
                    return gettext("Based on a linear approximation (very low accuracy, especially at the beginning of the print)");
                }
                case "analysis": {
                    return gettext("Based on the estimate from analysis of file (medium accuracy)");
                }
                case "mixed-analysis": {
                    return gettext("Based on a mix of estimate from analysis and calculation (medium accuracy)");
                }
                case "average": {
                    return gettext("Based on the average total of past prints of this model with the same printer profile (usually good accuracy)");
                }
                case "mixed-average": {
                    return gettext("Based on a mix of average total from past prints and calculation (usually good accuracy)");
                }
                case "estimate": {
                    return gettext("Based on the calculated estimate (best accuracy)");
                }
                default: {
                    return "";
                }
            }
        });
        self.printTimeLeftOriginClass = ko.pureComputed(function() {
            var value = self.printTimeLeftOrigin();
            switch (value) {
                default:
                case "linear": {
                    return "text-error";
                }
                case "analysis":
                case "mixed-analysis": {
                    return "text-warning";
                }
                case "average":
                case "mixed-average":
                case "estimate": {
                    return "text-success";
                }
            }
        });
        self.progressString = ko.pureComputed(function() {
            if (!self.progress())
                return 0;
            return self.progress();
        });
        self.progressBarString = ko.pureComputed(function() {
            if (!self.progress()) {
                return "";
            }
            return _.sprintf("%d%%", self.progress());
        });
        self.pauseString = ko.pureComputed(function() {
            if (self.isPaused())
                return gettext("Continue");
            else
                return gettext("Pause");
        });

        self.timelapseString = ko.pureComputed(function() {
            var timelapse = self.timelapse();

            if (!timelapse || !timelapse.hasOwnProperty("type"))
                return "-";

            var type = timelapse["type"];
            if (type == "zchange") {
                return gettext("On Z Change");
            } else if (type == "timed") {
                return gettext("Timed") + " (" + timelapse["options"]["interval"] + " " + gettext("sec") + ")";
            } else {
                return "-";
            }
        });

        self.userString = ko.pureComputed(function() {
            var user = self.user();
            if (!CONFIG_ACCESS_CONTROL || user === "_dummy") {
                return "";
            }

            if (user === "_api") {
                user = "API client";
            }

            var file = self.filename();
            return (user ? user : (file ? "-" : ""));
        });

        self.fromCurrentData = function(data) {
            self._fromData(data);
        };

        self.fromHistoryData = function(data) {
            self._fromData(data);
        };

        self.fromTimelapseData = function(data) {
            self.timelapse(data);
        };

        self._fromData = function(data) {
            self._processStateData(data.state);
            self._processJobData(data.job);
            self._processProgressData(data.progress);
            self._processZData(data.currentZ);
            self._processBusyFiles(data.busyFiles);
        };

        self._processStateData = function(data) {
            var prevPaused = self.isPaused();

            self.stateString(gettext(data.text));
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isCancelling(data.flags.cancelling);
            self.isPausing(data.flags.pausing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isSdReady(data.flags.sdReady);

            if (self.isPaused() != prevPaused) {
                if (self.isPaused()) {
                    self.titlePrintButton(self.TITLE_PRINT_BUTTON_PAUSED);
                    self.titlePauseButton(self.TITLE_PAUSE_BUTTON_PAUSED);
                } else {
                    self.titlePrintButton(self.TITLE_PRINT_BUTTON_UNPAUSED);
                    self.titlePauseButton(self.TITLE_PAUSE_BUTTON_UNPAUSED);
                }
            }
        };

        self._processJobData = function(data) {
            if (data.file) {
                self.filename(data.file.name);
                self.filepath(data.file.path);
                self.filesize(data.file.size);
                self.filedisplay(data.file.display);
                self.sd(data.file.origin == "sdcard");
            } else {
                self.filename(undefined);
                self.filepath(undefined);
                self.filesize(undefined);
                self.filedisplay(undefined);
                self.sd(undefined);
            }

            self.estimatedPrintTime(data.estimatedPrintTime);
            self.lastPrintTime(data.lastPrintTime);

            var result = [];
            if (data.filament && typeof(data.filament) == "object" && _.keys(data.filament).length > 0) {
                var keys = _.keys(data.filament);
                keys.sort();
                _.each(keys, function(key) {
                    if (!_.startsWith(key, "tool") || !data.filament[key] || !data.filament[key].hasOwnProperty("length") || data.filament[key].length <= 0) return;

                    result.push({
                        name: ko.observable(gettext("Tool") + " " + key.substr("tool".length)),
                        data: ko.observable(data.filament[key])
                    });
                });
            }
            self.filament(result);

            self.user(data.user);
        };

        self._processProgressData = function(data) {
            if (data.completion) {
                self.progress(data.completion);
            } else {
                self.progress(undefined);
            }
            self.filepos(data.filepos);
            self.printTime(data.printTime);
            self.printTimeLeft(data.printTimeLeft);
            self.printTimeLeftOrigin(data.printTimeLeftOrigin);
        };

        self._processZData = function(data) {
            self.currentHeight(data);
        };

        self._processBusyFiles = function(data) {
            var busyFiles = [];
            _.each(data, function(entry) {
                if (entry.hasOwnProperty("path") && entry.hasOwnProperty("origin")) {
                    busyFiles.push(entry.origin + ":" + entry.path);
                }
            });
            self.busyFiles(busyFiles);
        };

        self.print = function() {
            if (self.isPaused()) {
                showConfirmationDialog({
                    message: gettext("This will restart the print job from the beginning."),
                    onproceed: function() {
                        OctoPrint.job.restart();
                    }
                });
            } else {
                OctoPrint.job.start();
            }
        };

        self.onlyPause = function() {
            OctoPrint.job.pause();
        };

        self.onlyResume = function() {
            OctoPrint.job.resume();
        };

        self.pause = function(action) {
            OctoPrint.job.togglePause();
        };

        self.cancel = function() {
            if (!self.settings.feature_printCancelConfirmation()) {
                OctoPrint.job.cancel();
            } else {
                showConfirmationDialog({
                    message: gettext("This will cancel your print."),
                    cancel: gettext("No"),
                    proceed: gettext("Yes"),
                    onproceed: function() {
                        OctoPrint.job.cancel();
                    },
                    nofade: true
                });
            }
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: PrinterStateViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#state_wrapper", "#drop_overlay"]
    });
});

;

// source: js/app/viewmodels/printerprofiles.js
$(function() {
    var cleanProfile = function() {
        return {
            id: "",
            name: "",
            model: "",
            color: "default",
            volume: {
                formFactor: "rectangular",
                width: 200,
                depth: 200,
                height: 200,
                origin: "lowerleft",
                custom_box: false
            },
            heatedBed: true,
            axes: {
                x: {speed: 6000, inverted: false},
                y: {speed: 6000, inverted: false},
                z: {speed: 200, inverted: false},
                e: {speed: 300, inverted: false}
            },
            extruder: {
                count: 1,
                offsets: [
                    [0,0]
                ],
                nozzleDiameter: 0.4,
                sharedNozzle: false
            }
        }
    };

    function EditedProfileViewModel(profiles) {
        var self = this;

        self.profiles = profiles;

        self.isNew = ko.observable(false);

        self.name = ko.observable();
        self.color = ko.observable();
        self.identifier = ko.observable();
        self.identifierPlaceholder = ko.observable();
        self.model = ko.observable();

        self.volumeWidth = ko.observable();
        self.volumeHeight = ko.observable();
        self.volumeDepth = ko.observable();
        self.volumeFormFactor = ko.observable();
        self.volumeOrigin = ko.observable();

        self.volumeFormFactor.subscribe(function(value) {
            if (value == "circular") {
                self.volumeOrigin("center");
            }
        });
        self.volumeOrigin.subscribe(function() {
            self.toBoundingBoxPlaceholders(self.defaultBoundingBox(self.volumeWidth(), self.volumeDepth(), self.volumeHeight(), self.volumeOrigin()));
        });

        self.heatedBed = ko.observable();

        self.nozzleDiameter = ko.observable();
        self.extruders = ko.observable();
        self.extruderOffsets = ko.observableArray();
        self.sharedNozzle = ko.observable();

        self.axisXSpeed = ko.observable();
        self.axisYSpeed = ko.observable();
        self.axisZSpeed = ko.observable();
        self.axisESpeed = ko.observable();

        self.axisXInverted = ko.observable(false);
        self.axisYInverted = ko.observable(false);
        self.axisZInverted = ko.observable(false);
        self.axisEInverted = ko.observable(false);

        self.customBoundingBox = ko.observable(false);
        self.boundingBoxMinX = ko.observable();
        self.boundingBoxMinY = ko.observable();
        self.boundingBoxMinZ = ko.observable();
        self.boundingBoxMaxX = ko.observable();
        self.boundingBoxMaxY = ko.observable();
        self.boundingBoxMaxZ = ko.observable();
        self.boundingBoxMinXPlaceholder = ko.observable();
        self.boundingBoxMinYPlaceholder = ko.observable();
        self.boundingBoxMinZPlaceholder = ko.observable();
        self.boundingBoxMaxXPlaceholder = ko.observable();
        self.boundingBoxMaxYPlaceholder = ko.observable();
        self.boundingBoxMaxZPlaceholder = ko.observable();

        self.koExtruderOffsets = ko.pureComputed(function() {
            var extruderOffsets = self.extruderOffsets();
            var numExtruders = self.extruders();
            if (!numExtruders) {
                numExtruders = 1;
            }

            if (numExtruders - 1 > extruderOffsets.length) {
                for (var i = extruderOffsets.length; i < numExtruders; i++) {
                    extruderOffsets[i] = {
                        idx: i + 1,
                        x: ko.observable(0),
                        y: ko.observable(0)
                    }
                }
                self.extruderOffsets(extruderOffsets);
            }

            return extruderOffsets.slice(0, numExtruders - 1);
        });

        self.nameInvalid = ko.pureComputed(function() {
            return !self.name();
        });

        self.identifierInvalid = ko.pureComputed(function() {
            var identifier = self.identifier();
            var placeholder = self.identifierPlaceholder();
            var data = identifier;
            if (!identifier) {
                data = placeholder;
            }

            var validCharacters = (data && (data == self._sanitize(data)));

            var existingProfile = self.profiles.getItem(function(item) {return item.id == data});
            return !data || !validCharacters || (self.isNew() && existingProfile != undefined);
        });

        self.identifierInvalidText = ko.pureComputed(function() {
            if (!self.identifierInvalid()) {
                return "";
            }

            if (!self.identifier() && !self.identifierPlaceholder()) {
                return gettext("Identifier must be set");
            } else if (self.identifier() != self._sanitize(self.identifier())) {
                return gettext("Invalid characters, only a-z, A-Z, 0-9, -, ., _, ( and ) are allowed")
            } else {
                return gettext("A profile with such an identifier already exists");
            }
        });

        self.name.subscribe(function() {
            self.identifierPlaceholder(self._sanitize(self.name()).toLowerCase());
        });

        self.valid = function() {
            return !self.nameInvalid() && !self.identifierInvalid();
        };

        self.availableColors = ko.observable([
            {key: "default", name: gettext("default")},
            {key: "red", name: gettext("red")},
            {key: "orange", name: gettext("orange")},
            {key: "yellow", name: gettext("yellow")},
            {key: "green", name: gettext("green")},
            {key: "blue", name: gettext("blue")},
            {key: "black", name: gettext("black")}
        ]);

        self.availableOrigins = ko.pureComputed(function() {
            var formFactor = self.volumeFormFactor();

            var possibleOrigins = {
                "lowerleft": gettext("Lower Left"),
                "center": gettext("Center")
            };

            var keys = [];
            if (formFactor == "rectangular") {
                keys = ["lowerleft", "center"];
            } else if (formFactor == "circular") {
                keys = ["center"];
            }

            var result = [];
            _.each(keys, function(key) {
               result.push({key: key, name: possibleOrigins[key]});
            });
            return result;
        });

        self.fromProfileData = function(data) {
            self.isNew(data === undefined);

            if (data === undefined) {
                data = cleanProfile();
            }

            self.identifier(data.id);
            self.name(data.name);
            self.color(data.color);
            self.model(data.model);

            self.volumeWidth(data.volume.width);
            self.volumeHeight(data.volume.height);
            self.volumeDepth(data.volume.depth);
            self.volumeFormFactor(data.volume.formFactor);
            self.volumeOrigin(data.volume.origin);

            if (data.volume.custom_box) {
                self.toBoundingBoxData(data.volume.custom_box, true);
            } else {
                var box = self.defaultBoundingBox(data.volume.width, data.volume.depth, data.volume.height, data.volume.origin);
                self.toBoundingBoxData(box, false);
            }

            self.heatedBed(data.heatedBed);

            self.nozzleDiameter(data.extruder.nozzleDiameter);
            self.sharedNozzle(data.extruder.sharedNozzle);
            self.extruders(data.extruder.count);
            var offsets = [];
            if (data.extruder.count > 1) {
                _.each(_.slice(data.extruder.offsets, 1), function(offset, index) {
                    offsets.push({
                        idx: index + 1,
                        x: ko.observable(offset[0]),
                        y: ko.observable(offset[1])
                    });
                });
            }
            self.extruderOffsets(offsets);

            self.axisXSpeed(data.axes.x.speed);
            self.axisXInverted(data.axes.x.inverted);
            self.axisYSpeed(data.axes.y.speed);
            self.axisYInverted(data.axes.y.inverted);
            self.axisZSpeed(data.axes.z.speed);
            self.axisZInverted(data.axes.z.inverted);
            self.axisESpeed(data.axes.e.speed);
            self.axisEInverted(data.axes.e.inverted);
        };

        self.toProfileData = function() {
            var identifier = self.identifier();
            if (!identifier) {
                identifier = self.identifierPlaceholder();
            }

            var defaultProfile = cleanProfile();
            var valid = function(value, f, def) {
                var v = f(value);
                if (isNaN(v)) {
                    return def;
                }
                return v;
            };
            var validFloat = function(value, def) {
                return valid(value, parseFloat, def);
            };
            var validInt = function(value, def) {
                return valid(value, parseInt, def);
            };

            var profile = {
                id: identifier,
                name: self.name(),
                color: self.color(),
                model: self.model(),
                volume: {
                    width: validFloat(self.volumeWidth(), defaultProfile.volume.width),
                    depth: validFloat(self.volumeDepth(), defaultProfile.volume.depth),
                    height: validFloat(self.volumeHeight(), defaultProfile.volume.height),
                    formFactor: self.volumeFormFactor(),
                    origin: self.volumeOrigin()
                },
                heatedBed: self.heatedBed(),
                extruder: {
                    count: parseInt(self.extruders()),
                    offsets: [
                        [0.0, 0.0]
                    ],
                    nozzleDiameter: validFloat(self.nozzleDiameter(), defaultProfile.extruder.nozzleDiameter),
                    sharedNozzle: self.sharedNozzle()
                },
                axes: {
                    x: {
                        speed: validInt(self.axisXSpeed(), defaultProfile.axes.x.speed),
                        inverted: self.axisXInverted()
                    },
                    y: {
                        speed: validInt(self.axisYSpeed(), defaultProfile.axes.y.speed),
                        inverted: self.axisYInverted()
                    },
                    z: {
                        speed: validInt(self.axisZSpeed(), defaultProfile.axes.z.speed),
                        inverted: self.axisZInverted()
                    },
                    e: {
                        speed: validInt(self.axisESpeed(), defaultProfile.axes.e.speed),
                        inverted: self.axisEInverted()
                    }
                }
            };

            self.fillBoundingBoxData(profile);

            var offsetX, offsetY;
            if (self.extruders() > 1) {
                for (var i = 0; i < self.extruders() - 1; i++) {
                    var offset = [0.0, 0.0];
                    if (i < self.extruderOffsets().length) {
                        offsetX = validFloat(self.extruderOffsets()[i]["x"](), 0.0);
                        offsetY = validFloat(self.extruderOffsets()[i]["y"](), 0.0);
                        offset = [offsetX, offsetY];
                    }
                    profile.extruder.offsets.push(offset);
                }
            }

            if (profile.volume.formFactor == "circular") {
                profile.volume.depth = profile.volume.width;
            }

            return profile;
        };

        self.defaultBoundingBox = function(width, depth, height, origin) {
            if (origin == "center") {
                var halfWidth = width / 2.0;
                var halfDepth = depth / 2.0;

                return {
                    x_min: -halfWidth,
                    y_min: -halfDepth,
                    z_min: 0.0,
                    x_max: halfWidth,
                    y_max: halfDepth,
                    z_max: height
                }
            } else {
                return {
                    x_min: 0.0,
                    y_min: 0.0,
                    z_min: 0.0,
                    x_max: width,
                    y_max: depth,
                    z_max: height
                }
            }
        };

        self.toBoundingBoxData = function(box, custom) {
            self.customBoundingBox(custom);
            if (custom) {
                self.boundingBoxMinX(box.x_min);
                self.boundingBoxMinY(box.y_min);
                self.boundingBoxMinZ(box.z_min);
                self.boundingBoxMaxX(box.x_max);
                self.boundingBoxMaxY(box.y_max);
                self.boundingBoxMaxZ(box.z_max);
            } else {
                self.boundingBoxMinX(undefined);
                self.boundingBoxMinY(undefined);
                self.boundingBoxMinZ(undefined);
                self.boundingBoxMaxX(undefined);
                self.boundingBoxMaxY(undefined);
                self.boundingBoxMaxZ(undefined);
            }
            self.toBoundingBoxPlaceholders(box);
        };

        self.toBoundingBoxPlaceholders = function(box) {
            self.boundingBoxMinXPlaceholder(box.x_min);
            self.boundingBoxMinYPlaceholder(box.y_min);
            self.boundingBoxMinZPlaceholder(box.z_min);
            self.boundingBoxMaxXPlaceholder(box.x_max);
            self.boundingBoxMaxYPlaceholder(box.y_max);
            self.boundingBoxMaxZPlaceholder(box.z_max);
        };

        self.fillBoundingBoxData = function(profile) {
            if (self.customBoundingBox()) {
                var defaultBox = self.defaultBoundingBox(self.volumeWidth(), self.volumeDepth(), self.volumeHeight(), self.volumeOrigin());
                profile.volume.custom_box = {
                    x_min: (self.boundingBoxMinX() !== undefined) ? Math.min(self.boundingBoxMinX(), defaultBox.x_min) : defaultBox.x_min,
                    y_min: (self.boundingBoxMinY() !== undefined) ? Math.min(self.boundingBoxMinY(), defaultBox.y_min) : defaultBox.y_min,
                    z_min: (self.boundingBoxMinZ() !== undefined) ? Math.min(self.boundingBoxMinZ(), defaultBox.z_min) : defaultBox.z_min,
                    x_max: (self.boundingBoxMaxX() !== undefined) ? Math.max(self.boundingBoxMaxX(), defaultBox.x_max) : defaultBox.x_max,
                    y_max: (self.boundingBoxMaxY() !== undefined) ? Math.max(self.boundingBoxMaxY(), defaultBox.y_max) : defaultBox.y_max,
                    z_max: (self.boundingBoxMaxZ() !== undefined) ? Math.max(self.boundingBoxMaxZ(), defaultBox.z_max) : defaultBox.z_max
                };
            } else {
                profile.volume.custom_box = false;
            }
        };

        self._sanitize = function(name) {
            return name.replace(/[^a-zA-Z0-9\-_\.\(\) ]/g, "").replace(/ /g, "_");
        };

        self.fromProfileData(cleanProfile());
    }

    function PrinterProfilesViewModel() {
        var self = this;

        self.requestInProgress = ko.observable(false);

        self.profiles = new ItemListHelper(
            "printerProfiles",
            {
                "name": function(a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase()) return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {},
            "name",
            [],
            [],
            10
        );
        self.defaultProfile = ko.observable();
        self.currentProfile = ko.observable();

        self.createProfileEditor = function(data) {
            var editor = new EditedProfileViewModel(self.profiles);
            if (data !== undefined) {
                editor.fromProfileData(data);
            }
            return editor;
        };

        self.editor = self.createProfileEditor();
        self.currentProfileData = ko.observable(ko.mapping.fromJS(cleanProfile()));

        self.enableEditorSubmitButton = ko.pureComputed(function() {
            return self.editor.valid() && !self.requestInProgress();
        });

        self.makeDefault = function(data) {
            var profile = {
                id: data.id,
                default: true
            };

            self.updateProfile(profile);
        };

        self.canMakeDefault = function(data) {
            return !data.isdefault();
        };

        self.canRemove = function(data) {
            return !data.iscurrent() && !data.isdefault();
        };

        self.requestData = function() {
            return OctoPrint.printerprofiles.list()
                .done(self.fromResponse);
        };

        self.fromResponse = function(data) {
            var items = [];
            var defaultProfile = undefined;
            var currentProfile = undefined;
            var currentProfileData = undefined;
            _.each(data.profiles, function(entry) {
                if (entry.default) {
                    defaultProfile = entry.id;
                }
                if (entry.current) {
                    currentProfile = entry.id;
                    currentProfileData = ko.mapping.fromJS(entry, self.currentProfileData);
                }
                entry["isdefault"] = ko.observable(entry.default);
                entry["iscurrent"] = ko.observable(entry.current);
                items.push(entry);
            });
            self.profiles.updateItems(items);
            self.defaultProfile(defaultProfile);

            if (currentProfile && currentProfileData) {
                self.currentProfile(currentProfile);
                self.currentProfileData(currentProfileData);
            } else {
                // shouldn't normally happen, but just to not have anything else crash...
                log.warn("Current printer profile could not be detected, using default values");
                self.currentProfile("");
                self.currentProfileData(ko.mapping.fromJS(cleanProfile(), self.currentProfileData));
            }
        };

        self.addProfile = function(callback) {
            var profile = self.editor.toProfileData();
            self.requestInProgress(true);
            OctoPrint.printerprofiles.add(profile)
                .done(function() {
                    if (callback !== undefined) {
                        callback();
                    }
                    self.requestData();
                })
                .fail(function(xhr) {
                    var text = gettext("There was unexpected error while saving the printer profile, please consult the logs.");
                    new PNotify({title: gettext("Could not add profile"), text: text, type: "error", hide: false});
                })
                .always(function() {
                    self.requestInProgress(false);
                });
        };

        self.removeProfile = function(data) {
            var perform = function() {
                self.requestInProgress(true);
                OctoPrint.printerprofiles.delete(data.id, {url: data.resource})
                    .done(function() {
                        self.requestData()
                            .always(function() {
                                self.requestInProgress(false);
                            });
                    })
                    .fail(function(xhr) {
                        var text;
                        if (xhr.status == 409) {
                            text = gettext("Cannot delete the default profile or the currently active profile.");
                        } else {
                            text = gettext("There was unexpected error while removing the printer profile, please consult the logs.");
                        }
                        new PNotify({title: gettext("Could not delete profile"), text: text, type: "error", hide: false});
                        self.requestInProgress(false);
                    });
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to delete the printer profile \"%(name)s\"."), {name: data.name}),
                                   perform);
        };

        self.updateProfile = function(profile, callback) {
            if (profile == undefined) {
                profile = self.editor.toProfileData();
            }

            self.requestInProgress(true);
            OctoPrint.printerprofiles.update(profile.id, profile)
                .done(function() {
                    if (callback !== undefined) {
                        callback();
                    }
                    self.requestData()
                        .always(function() {
                            self.requestInProgress(false);
                        });
                })
                .fail(function() {
                    var text = gettext("There was unexpected error while updating the printer profile, please consult the logs.");
                    new PNotify({title: gettext("Could not update profile"), text: text, type: "error", hide: false});
                    self.requestInProgress(false);
                });
        };

        self.showEditProfileDialog = function(data) {
            self.editor.fromProfileData(data);

            var editDialog = $("#settings_printerProfiles_editDialog");
            var confirmButton = $("button.btn-confirm", editDialog);
            var dialogTitle = $("h3.modal-title", editDialog);

            var add = data === undefined;
            dialogTitle.text(add ? gettext("Add Printer Profile") : _.sprintf(gettext("Edit Printer Profile \"%(name)s\""), {name: data.name}));
            confirmButton.unbind("click");
            confirmButton.bind("click", function() {
                if (self.enableEditorSubmitButton()) {
                    self.confirmEditProfile(add);
                }
            });

            $('ul.nav-pills a[data-toggle="tab"]:first', editDialog).tab("show");
            editDialog.modal({
                minHeight: function() { return Math.max($.fn.modal.defaults.maxHeight() - 80, 250); }
            }).css({
                width: 'auto',
                'margin-left': function() { return -($(this).width() /2); }
            });
        };

        self.confirmEditProfile = function(add) {
            var callback = function() {
                $("#settings_printerProfiles_editDialog").modal("hide");
            };

            if (add) {
                self.addProfile(callback);
            } else {
                self.updateProfile(undefined, callback);
            }
        };

        self.onSettingsShown = self.requestData;
        self.onStartup = self.requestData;
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: PrinterProfilesViewModel
    });
});

;

// source: js/app/viewmodels/settings.js
$(function() {
    function SettingsViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.users = parameters[1];
        self.printerProfiles = parameters[2];
        self.about = parameters[3];

        // use this promise to do certain things once the SettingsViewModel has processed
        // its first request
        var firstRequest = $.Deferred();
        self.firstRequest = firstRequest.promise();

        self.allViewModels = [];

        self.receiving = ko.observable(false);
        self.sending = ko.observable(false);
        self.exchanging = ko.pureComputed(function() {
            return self.receiving() || self.sending();
        });
        self.outstanding = [];

        self.active = false;
        self.sawUpdateEventWhileActive = false;
        self.ignoreNextUpdateEvent = false;

        self.settingsDialog = undefined;
        self.settings_dialog_update_detected = undefined;
        self.translationManagerDialog = undefined;
        self.translationUploadElement = $("#settings_appearance_managelanguagesdialog_upload");
        self.translationUploadButton = $("#settings_appearance_managelanguagesdialog_upload_start");

        self.translationUploadFilename = ko.observable();
        self.invalidTranslationArchive = ko.pureComputed(function() {
            var name = self.translationUploadFilename();
            return name !== undefined && !(_.endsWith(name.toLocaleLowerCase(), ".zip") || _.endsWith(name.toLocaleLowerCase(), ".tar.gz") || _.endsWith(name.toLocaleLowerCase(), ".tgz") || _.endsWith(name.toLocaleLowerCase(), ".tar"));
        });
        self.enableTranslationUpload = ko.pureComputed(function() {
            var name = self.translationUploadFilename();
            return name !== undefined && name.trim() != "" && !self.invalidTranslationArchive();
        });

        self.translations = new ItemListHelper(
            "settings.translations",
            {
                "locale": function (a, b) {
                    // sorts ascending
                    if (a["locale"].toLocaleLowerCase() < b["locale"].toLocaleLowerCase()) return -1;
                    if (a["locale"].toLocaleLowerCase() > b["locale"].toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {
            },
            "locale",
            [],
            [],
            0
        );

        self.appearance_available_colors = ko.observable([
            {key: "default", name: gettext("default")},
            {key: "red", name: gettext("red")},
            {key: "orange", name: gettext("orange")},
            {key: "yellow", name: gettext("yellow")},
            {key: "green", name: gettext("green")},
            {key: "blue", name: gettext("blue")},
            {key: "violet", name: gettext("violet")},
            {key: "black", name: gettext("black")},
            {key: "white", name: gettext("white")},
        ]);

        self.appearance_colorName = function(color) {
            switch (color) {
                case "red":
                    return gettext("red");
                case "orange":
                    return gettext("orange");
                case "yellow":
                    return gettext("yellow");
                case "green":
                    return gettext("green");
                case "blue":
                    return gettext("blue");
                case "violet":
                    return gettext("violet");
                case "black":
                    return gettext("black");
                case "white":
                    return gettext("white");
                case "default":
                    return gettext("default");
                default:
                    return color;
            }
        };

        self.webcam_available_ratios = ["16:9", "4:3"];

        var auto_locale = {language: "_default", display: gettext("Autodetect from browser"), english: undefined};
        self.locales = ko.observableArray([auto_locale].concat(_.sortBy(_.values(AVAILABLE_LOCALES), function(n) {
            return n.display;
        })));
        self.locale_languages = _.keys(AVAILABLE_LOCALES);

        self.api_enabled = ko.observable(undefined);
        self.api_key = ko.observable(undefined);
        self.api_allowCrossOrigin = ko.observable(undefined);

        self.appearance_name = ko.observable(undefined);
        self.appearance_color = ko.observable(undefined);
        self.appearance_colorTransparent = ko.observable();
        self.appearance_colorIcon = ko.observable();
        self.appearance_defaultLanguage = ko.observable();
        self.appearance_showFahrenheitAlso = ko.observable(undefined);

        self.printer_defaultExtrusionLength = ko.observable(undefined);

        self.webcam_streamUrl = ko.observable(undefined);
        self.webcam_streamRatio = ko.observable(undefined);
        self.webcam_streamTimeout = ko.observable(undefined);
        self.webcam_snapshotUrl = ko.observable(undefined);
        self.webcam_snapshotTimeout = ko.observable(undefined);
        self.webcam_snapshotSslValidation = ko.observable(undefined);
        self.webcam_ffmpegPath = ko.observable(undefined);
        self.webcam_bitrate = ko.observable(undefined);
        self.webcam_ffmpegThreads = ko.observable(undefined);
        self.webcam_watermark = ko.observable(undefined);
        self.webcam_flipH = ko.observable(undefined);
        self.webcam_flipV = ko.observable(undefined);
        self.webcam_rotate90 = ko.observable(undefined);

        self.feature_gcodeViewer = ko.observable(undefined);
        self.feature_sizeThreshold = ko.observable();
        self.feature_mobileSizeThreshold = ko.observable();
        self.feature_sizeThreshold_str = sizeObservable(self.feature_sizeThreshold);
        self.feature_mobileSizeThreshold_str = sizeObservable(self.feature_mobileSizeThreshold);
        self.feature_temperatureGraph = ko.observable(undefined);
        self.feature_sdSupport = ko.observable(undefined);
        self.feature_keyboardControl = ko.observable(undefined);
        self.feature_pollWatched = ko.observable(undefined);
        self.feature_modelSizeDetection = ko.observable(undefined);
        self.feature_printCancelConfirmation = ko.observable(undefined);
        self.feature_g90InfluencesExtruder = ko.observable(undefined);
        self.feature_autoUppercaseBlacklist = ko.observable(undefined);

        self.serial_port = ko.observable();
        self.serial_baudrate = ko.observable();
        self.serial_portOptions = ko.observableArray([]);
        self.serial_baudrateOptions = ko.observableArray([]);
        self.serial_autoconnect = ko.observable(undefined);
        self.serial_timeoutConnection = ko.observable(undefined);
        self.serial_timeoutDetection = ko.observable(undefined);
        self.serial_timeoutCommunication = ko.observable(undefined);
        self.serial_timeoutCommunicationBusy = ko.observable(undefined);
        self.serial_timeoutTemperature = ko.observable(undefined);
        self.serial_timeoutTemperatureTargetSet = ko.observable(undefined);
        self.serial_timeoutTemperatureAutoreport = ko.observable(undefined);
        self.serial_timeoutSdStatus = ko.observable(undefined);
        self.serial_timeoutSdStatusAutoreport = ko.observable(undefined);
        self.serial_timeoutBaudrateDetectionPause = ko.observable(undefined);
        self.serial_timeoutPositionLogWait = ko.observable(undefined);
        self.serial_log = ko.observable(undefined);
        self.serial_additionalPorts = ko.observable(undefined);
        self.serial_additionalBaudrates = ko.observable(undefined);
        self.serial_longRunningCommands = ko.observable(undefined);
        self.serial_checksumRequiringCommands = ko.observable(undefined);
        self.serial_helloCommand = ko.observable(undefined);
        self.serial_serialErrorBehaviour = ko.observable("cancel");
        self.serial_triggerOkForM29 = ko.observable(undefined);
        self.serial_blockM0M1 = ko.observable(undefined);
        self.serial_waitForStart =  ko.observable(undefined);
        self.serial_sendChecksum =  ko.observable("print");
        self.serial_sdRelativePath =  ko.observable(undefined);
        self.serial_sdAlwaysAvailable =  ko.observable(undefined);
        self.serial_swallowOkAfterResend =  ko.observable(undefined);
        self.serial_repetierTargetTemp =  ko.observable(undefined);
        self.serial_disableExternalHeatupDetection =  ko.observable(undefined);
        self.serial_ignoreIdenticalResends =  ko.observable(undefined);
        self.serial_firmwareDetection =  ko.observable(undefined);
        self.serial_blockWhileDwelling =  ko.observable(undefined);
        self.serial_supportResendsWithoutOk = ko.observable(undefined);
        self.serial_logPositionOnPause = ko.observable(undefined);
        self.serial_logPositionOnCancel = ko.observable(undefined);
        self.serial_abortHeatupOnCancel = ko.observable(undefined);
        self.serial_maxTimeoutsIdle = ko.observable(undefined);
        self.serial_maxTimeoutsPrinting = ko.observable(undefined);
        self.serial_maxTimeoutsLong = ko.observable(undefined);
        self.serial_capAutoreportTemp = ko.observable(undefined);
        self.serial_capAutoreportSdStatus = ko.observable(undefined);
        self.serial_capBusyProtocol = ko.observable(undefined);
        self.serial_capEmergencyParser = ko.observable(undefined);

        self.folder_uploads = ko.observable(undefined);
        self.folder_timelapse = ko.observable(undefined);
        self.folder_timelapseTmp = ko.observable(undefined);
        self.folder_logs = ko.observable(undefined);
        self.folder_watched = ko.observable(undefined);

        self.scripts_gcode_beforePrintStarted = ko.observable(undefined);
        self.scripts_gcode_afterPrintDone = ko.observable(undefined);
        self.scripts_gcode_afterPrintCancelled = ko.observable(undefined);
        self.scripts_gcode_afterPrintPaused = ko.observable(undefined);
        self.scripts_gcode_beforePrintResumed = ko.observable(undefined);
        self.scripts_gcode_afterPrinterConnected = ko.observable(undefined);
        self.scripts_gcode_beforePrinterDisconnected = ko.observable(undefined);
        self.scripts_gcode_afterToolChange = ko.observable(undefined);
        self.scripts_gcode_beforeToolChange = ko.observable(undefined);

        self.temperature_profiles = ko.observableArray(undefined);
        self.temperature_cutoff = ko.observable(undefined);
        self.temperature_sendAutomatically = ko.observable(undefined);
        self.temperature_sendAutomaticallyAfter = ko.observable(undefined);

        self.system_actions = ko.observableArray([]);

        self.terminalFilters = ko.observableArray([]);

        self.server_commands_systemShutdownCommand = ko.observable(undefined);
        self.server_commands_systemRestartCommand = ko.observable(undefined);
        self.server_commands_serverRestartCommand = ko.observable(undefined);

        self.server_diskspace_warning = ko.observable();
        self.server_diskspace_critical = ko.observable();
        self.server_diskspace_warning_str = sizeObservable(self.server_diskspace_warning);
        self.server_diskspace_critical_str = sizeObservable(self.server_diskspace_critical);

        self.server_onlineCheck_enabled = ko.observable();
        self.server_onlineCheck_interval = ko.observable();
        self.server_onlineCheck_host = ko.observable();
        self.server_onlineCheck_port = ko.observable();

        self.server_pluginBlacklist_enabled = ko.observable();
        self.server_pluginBlacklist_url = ko.observable();
        self.server_pluginBlacklist_ttl = ko.observable();

        self.settings = undefined;
        self.lastReceivedSettings = undefined;

        self.webcam_ffmpegPathText = ko.observable();
        self.webcam_ffmpegPathOk = ko.observable(false);
        self.webcam_ffmpegPathBroken = ko.observable(false);
        self.webcam_ffmpegPathReset = function() {
            self.webcam_ffmpegPathText("");
            self.webcam_ffmpegPathOk(false);
            self.webcam_ffmpegPathBroken(false);
        };

        self.server_onlineCheckText = ko.observable();
        self.server_onlineCheckOk = ko.observable(false);
        self.server_onlineCheckBroken = ko.observable(false);
        self.server_onlineCheckReset = function() {
            self.server_onlineCheckText("");
            self.server_onlineCheckOk(false);
            self.server_onlineCheckBroken(false);
        };

        var folderTypes = ["uploads", "timelapse", "timelapseTmp", "logs", "watched"];
        self.testFolderConfigText = {};
        self.testFolderConfigOk = {};
        self.testFolderConfigBroken = {};
        _.each(folderTypes, function(folderType) {
            self.testFolderConfigText[folderType] = ko.observable("");
            self.testFolderConfigOk[folderType] = ko.observable(false);
            self.testFolderConfigBroken[folderType] = ko.observable(false);
        });
        self.testFolderConfigReset = function() {
            _.each(folderTypes, function(folderType) {
                self.testFolderConfigText[folderType]("");
                self.testFolderConfigOk[folderType](false);
                self.testFolderConfigBroken[folderType](false);
            });
        };

        self.observableCopies = {
            "feature_waitForStart": "serial_waitForStart",
            "feature_sendChecksum": "serial_sendChecksum",
            "feature_sdRelativePath": "serial_sdRelativePath",
            "feature_sdAlwaysAvailable": "serial_sdAlwaysAvailable",
            "feature_swallowOkAfterResend": "serial_swallowOkAfterResend",
            "feature_repetierTargetTemp": "serial_repetierTargetTemp",
            "feature_disableExternalHeatupDetection": "serial_disableExternalHeatupDetection",
            "feature_ignoreIdenticalResends": "serial_ignoreIdenticalResends",
            "feature_firmwareDetection": "serial_firmwareDetection",
            "feature_blockWhileDwelling": "serial_blockWhileDwelling",
            "serial_": "feature_"
        };
        _.each(self.observableCopies, function(value, key) {
            if (self.hasOwnProperty(value)) {
                self[key] = self[value];
            }
        });

        self.addTemperatureProfile = function() {
            self.temperature_profiles.push({name: "New", extruder:0, bed:0});
        };

        self.removeTemperatureProfile = function(profile) {
            self.temperature_profiles.remove(profile);
        };

        self.addTerminalFilter = function() {
            self.terminalFilters.push({name: "New", regex: "(Send: (N\d+\s+)?M105)|(Recv:\s+(ok\s+)?.*(B|T\d*):\d+)"})
        };

        self.removeTerminalFilter = function(filter) {
            self.terminalFilters.remove(filter);
        };

        self.testWebcamStreamUrlBusy = ko.observable(false);
        self.testWebcamStreamUrl = function() {
            if (!self.webcam_streamUrl()) {
                return;
            }

            if (self.testWebcamStreamUrlBusy()) {
                return;
            }

            var text = gettext("If you see your webcam stream below, the entered stream URL is ok.");
            var image = $('<img src="' + self.webcam_streamUrl() + '">');
            var message = $("<p></p>")
                .append(text)
                .append(image);

            self.testWebcamStreamUrlBusy(true);
            showMessageDialog({
                title: gettext("Stream test"),
                message: message,
                onclose: function() {
                    self.testWebcamStreamUrlBusy(false);
                }
            });
        };

        self.testWebcamSnapshotUrlBusy = ko.observable(false);
        self.testWebcamSnapshotUrl = function(viewModel, event) {
            if (!self.webcam_snapshotUrl()) {
                return;
            }

            if (self.testWebcamSnapshotUrlBusy()) {
                return;
            }

            var errorText = gettext("Could not retrieve snapshot URL, please double check the URL");
            var errorTitle = gettext("Snapshot test failed");

            self.testWebcamSnapshotUrlBusy(true);
            OctoPrint.util.testUrl(self.webcam_snapshotUrl(), {
                method: "GET",
                response: "bytes",
                timeout: self.webcam_snapshotTimeout(),
                validSsl: self.webcam_snapshotSslValidation(),
                content_type_whitelist: ["image/*"]
            })
                .done(function(response) {
                    if (!response.result) {
                        if (response.status && response.response && response.response.content_type) {
                            // we could contact the server, but something else was wrong, probably the mime type
                            errorText = gettext("Could retrieve the snapshot URL, but it didn't look like an " +
                                                "image. Got this as a content type header: <code>%(content_type)s</code>. Please " +
                                                "double check that the URL is returning static images, not multipart data " +
                                                "or videos.");
                            errorText = _.sprintf(errorText, {content_type: response.response.content_type});
                        }

                        showMessageDialog({
                            title: errorTitle,
                            message: errorText,
                            onclose: function() {
                                self.testWebcamSnapshotUrlBusy(false);
                            }
                        });
                        return;
                    }

                    var content = response.response.content;
                    var contentType = response.response.content_type

                    var mimeType = "image/jpeg";
                    if (contentType) {
                        mimeType = contentType.split(";")[0];
                    }

                    var text = gettext("If you see your webcam snapshot picture below, the entered snapshot URL is ok.");
                    showMessageDialog({
                        title: gettext("Snapshot test"),
                        message: $('<p>' + text + '</p><p><img src="data:' + mimeType + ';base64,' + content + '" /></p>'),
                        onclose: function() {
                            self.testWebcamSnapshotUrlBusy(false);
                        }
                    });
                })
                .fail(function() {
                    showMessageDialog({
                        title: errorTitle,
                        message: errorText,
                        onclose: function() {
                            self.testWebcamSnapshotUrlBusy(false);
                        }
                    });
                });
        };

        self.testWebcamFfmpegPathBusy = ko.observable(false);
        self.testWebcamFfmpegPath = function() {
            if (!self.webcam_ffmpegPath()) {
                return;
            }

            if (self.testWebcamFfmpegPathBusy()) {
                return;
            }

            self.testWebcamFfmpegPathBusy(true);
            OctoPrint.util.testExecutable(self.webcam_ffmpegPath())
                .done(function(response) {
                    if (!response.result) {
                        if (!response.exists) {
                            self.webcam_ffmpegPathText(gettext("The path doesn't exist"));
                        } else if (!response.typeok) {
                            self.webcam_ffmpegPathText(gettext("The path is not a file"));
                        } else if (!response.access) {
                            self.webcam_ffmpegPathText(gettext("The path is not an executable"));
                        }
                    } else {
                        self.webcam_ffmpegPathText(gettext("The path is valid"));
                    }
                    self.webcam_ffmpegPathOk(response.result);
                    self.webcam_ffmpegPathBroken(!response.result);
                })
                .always(function() {
                    self.testWebcamFfmpegPathBusy(false);
                });
        };

        self.testOnlineConnectivityConfigBusy = ko.observable(false);
        self.testOnlineConnectivityConfig = function() {
            if (!self.server_onlineCheck_host()) return;
            if (!self.server_onlineCheck_port()) return;
            if (self.testOnlineConnectivityConfigBusy()) return;

            self.testOnlineConnectivityConfigBusy(true);
            OctoPrint.util.testServer(self.server_onlineCheck_host(), self.server_onlineCheck_port())
                .done(function(response) {
                    if (!response.result) {
                        self.server_onlineCheckText(gettext("The server is not reachable"));
                    } else {
                        self.server_onlineCheckText(gettext("The server is reachable"));
                    }
                    self.server_onlineCheckOk(response.result);
                    self.server_onlineCheckBroken(!response.result);
                })
                .always(function() {
                    self.testOnlineConnectivityConfigBusy(false);
                });
        };

        self.testFolderConfigBusy = ko.observable(false);
        self.testFolderConfig = function(folder) {
            var observable = "folder_" + folder;
            if (!self.hasOwnProperty(observable)) return;

            if (self.testFolderConfigBusy()) return;
            self.testFolderConfigBusy(true);

            var opts = {
                check_type: "dir",
                check_access: "w",
                allow_create_dir: true,
                check_writable_dir: true
            };
            var path = self[observable]();
            OctoPrint.util.testPath(path, opts)
                .done(function(response) {
                    if (!response.result) {
                        if (response.broken_symlink) {
                            self.testFolderConfigText[folder](gettext("The path is a broken symlink."));
                        } else if (!response.exists) {
                            self.testFolderConfigText[folder](gettext("The path does not exist and cannot be created."));
                        } else if (!response.typeok) {
                            self.testFolderConfigText[folder](gettext("The path is not a folder."));
                        } else if (!response.access) {
                            self.testFolderConfigText[folder](gettext("The path is not writable."));
                        }
                    } else {
                        self.testFolderConfigText[folder](gettext("The path is valid"));
                    }
                    self.testFolderConfigOk[folder](response.result);
                    self.testFolderConfigBroken[folder](!response.result);
                })
                .always(function() {
                    self.testFolderConfigBusy(false);
                });
        };

        self.onSettingsHidden = function() {
            self.webcam_ffmpegPathReset();
            self.server_onlineCheckReset();
            self.testFolderConfigReset();
        };

        self.isDialogActive = function() {
            return self.settingsDialog.is(":visible");
        };

        self.onStartup = function() {
            self.settingsDialog = $('#settings_dialog');
            self.settingsUpdatedDialog = $('#settings_dialog_update_detected');
            self.translationManagerDialog = $('#settings_appearance_managelanguagesdialog');
            self.translationUploadElement = $("#settings_appearance_managelanguagesdialog_upload");
            self.translationUploadButton = $("#settings_appearance_managelanguagesdialog_upload_start");

            self.translationUploadElement.fileupload({
                dataType: "json",
                maxNumberOfFiles: 1,
                autoUpload: false,
                headers: OctoPrint.getRequestHeaders(),
                add: function(e, data) {
                    if (data.files.length == 0) {
                        return false;
                    }

                    self.translationUploadFilename(data.files[0].name);

                    self.translationUploadButton.unbind("click");
                    self.translationUploadButton.bind("click", function() {
                        data.submit();
                        return false;
                    });
                },
                done: function(e, data) {
                    self.translationUploadButton.unbind("click");
                    self.translationUploadFilename(undefined);
                    self.fromTranslationResponse(data.result);
                },
                fail: function(e, data) {
                    self.translationUploadButton.unbind("click");
                    self.translationUploadFilename(undefined);
                }
            });
        };

        self.onAllBound = function(allViewModels) {
            self.allViewModels = allViewModels;

            self.settingsDialog.on('show', function(event) {
                OctoPrint.coreui.settingsOpen = true;
                if (event.target.id == "settings_dialog") {
                    self.requestTranslationData();
                    callViewModels(allViewModels, "onSettingsShown");
                }
            });
            self.settingsDialog.on('hidden', function(event) {
                OctoPrint.coreui.settingsOpen = false;
                if (event.target.id == "settings_dialog") {
                    callViewModels(allViewModels, "onSettingsHidden");
                }
            });
            self.settingsDialog.on('beforeSave', function () {
                callViewModels(allViewModels, "onSettingsBeforeSave");
            });

            $(".reload_all", self.settingsUpdatedDialog).click(function(e) {
                e.preventDefault();
                self.settingsUpdatedDialog.modal("hide");
                self.requestData();
                return false;
            });
            $(".reload_nonconflicts", self.settingsUpdatedDialog).click(function(e) {
                e.preventDefault();
                self.settingsUpdatedDialog.modal("hide");
                self.requestData(undefined, true);
                return false;
            });

            // reset scroll position on tab change
            $('ul.nav-list a[data-toggle="tab"]', self.settingsDialog).on("show", function() {
                self._resetScrollPosition();
            });
        };

        self.show = function(tab) {
            // select first or specified tab
            self.selectTab(tab);

            // reset scroll position
            self._resetScrollPosition();

            // show settings, ensure centered position
            self.settingsDialog.modal({
                minHeight: function() { return Math.max($.fn.modal.defaults.maxHeight() - 80, 250); }
            }).css({
                width: 'auto',
                'margin-left': function() { return -($(this).width() /2); }
            });

            return false;
        };

        self.hide = function() {
            self.settingsDialog.modal("hide");
        };

        self.generateApiKey = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            showConfirmationDialog(gettext("This will generate a new API Key. The old API Key will cease to function immediately."),
                function() {
                    OctoPrint.settings.generateApiKey()
                        .done(function(response) {
                            self.api_key(response.apikey);
                            self.requestData();
                        });
                });
        };

        self.copyApiKey = function() {
            copyToClipboard(self.api_key());
        };

        self.showTranslationManager = function() {
            self.translationManagerDialog.modal();
            return false;
        };

        self.requestData = function(local) {
            // handle old parameter format
            var callback = undefined;
            if (arguments.length == 2 || _.isFunction(local)) {
                var exc = new Error();
                log.warn("The callback parameter of SettingsViewModel.requestData is deprecated, the method now returns a promise, please use that instead. Stacktrace:", (exc.stack || exc.stacktrace || "<n/a>"));

                if (arguments.length == 2) {
                    callback = arguments[0];
                    local = arguments[1];
                } else {
                    callback = local;
                    local = false;
                }
            }

            // handler for any explicitely provided callbacks
            var callbackHandler = function() {
                if (!callback) return;
                try {
                    callback();
                } catch (exc) {
                    log.error("Error calling settings callback", callback, ":", (exc.stack || exc.stacktrace || exc));
                }
            };

            // if a request is already active, create a new deferred and return
            // its promise, it will be resolved in the response handler of the
            // current request
            if (self.receiving()) {
                var deferred = $.Deferred();
                self.outstanding.push(deferred);

                if (callback) {
                    // if we have a callback, we need to make sure it will
                    // get called when the deferred is resolved
                    deferred.done(callbackHandler);
                }

                return deferred.promise();
            }

            // perform the request
            self.receiving(true);
            return OctoPrint.settings.get()
                .always(function() {
                    self.receiving(false);
                })
                .done(function(response) {
                    self.fromResponse(response, local);

                    if (callback) {
                        var deferred = $.Deferred();
                        deferred.done(callbackHandler);
                        self.outstanding.push(deferred);
                    }

                    // resolve all promises
                    var args = arguments;
                    _.each(self.outstanding, function(deferred) {
                        deferred.resolve(args);
                    });
                    self.outstanding = [];
                })
                .fail(function() {
                    // reject all promises
                    var args = arguments;
                    _.each(self.outstanding, function(deferred) {
                        deferred.reject(args);
                    });
                    self.outstanding = [];
                });
        };

        self.requestTranslationData = function() {
            return OctoPrint.languages.list()
                .done(self.fromTranslationResponse);
        };

        self.fromTranslationResponse = function(response) {
            var translationsByLocale = {};
            _.each(response.language_packs, function(item, key) {
                _.each(item.languages, function(pack) {
                    var locale = pack.locale;
                    if (!_.has(translationsByLocale, locale)) {
                        translationsByLocale[locale] = {
                            locale: locale,
                            display: pack.locale_display,
                            english: pack.locale_english,
                            packs: []
                        };
                    }

                    translationsByLocale[locale]["packs"].push({
                        identifier: key,
                        display: item.display,
                        pack: pack
                    });
                });
            });

            var translations = [];
            _.each(translationsByLocale, function(item) {
                item["packs"].sort(function(a, b) {
                    if (a.identifier == "_core") return -1;
                    if (b.identifier == "_core") return 1;

                    if (a.display < b.display) return -1;
                    if (a.display > b.display) return 1;
                    return 0;
                });
                translations.push(item);
            });

            self.translations.updateItems(translations);
        };

        self.languagePackDisplay = function(item) {
            return item.display + ((item.english != undefined) ? ' (' + item.english + ')' : '');
        };

        self.languagePacksAvailable = ko.pureComputed(function() {
            return self.translations.allSize() > 0;
        });

        self.deleteLanguagePack = function(locale, pack) {
            OctoPrint.languages.delete(locale, pack)
                .done(self.fromTranslationResponse);
        };

        /**
         * Fetches the settings as currently stored in this client instance.
         */
        self.getLocalData = function() {
            var data = {};
            if (self.settings != undefined) {
                data = ko.mapping.toJS(self.settings);
            }

            // some special read functions for various observables
            var specialMappings = {
                feature: {
                    autoUppercaseBlacklist: function() { return splitTextToArray(self.feature_autoUppercaseBlacklist(), ",", true) }
                },
                serial: {
                    additionalPorts : function() { return commentableLinesToArray(self.serial_additionalPorts()) },
                    additionalBaudrates: function() { return _.map(splitTextToArray(self.serial_additionalBaudrates(), ",", true, function(item) { return !isNaN(parseInt(item)); }), function(item) { return parseInt(item); }) },
                    longRunningCommands: function() { return splitTextToArray(self.serial_longRunningCommands(), ",", true) },
                    checksumRequiringCommands: function() { return splitTextToArray(self.serial_checksumRequiringCommands(), ",", true) },
                    externalHeatupDetection: function() { return !self.serial_disableExternalHeatupDetection()},
                    alwaysSendChecksum: function() { return self.serial_sendChecksum() === "always"},
                    neverSendChecksum: function() { return self.serial_sendChecksum() === "never"},
                    ignoreErrorsFromFirmware: function() { return self.serial_serialErrorBehaviour() === "ignore"},
                    disconnectOnErrors: function() { return self.serial_serialErrorBehaviour() === "disconnect" }
                },
                scripts: {
                    gcode: function() {
                        // we have a special handler function for the gcode scripts since the
                        // server will always send us those that have been set already, so we
                        // can't depend on all keys that we support to be present in the
                        // original request we iterate through in mapFromObservables to
                        // generate our response - hence we use our observables instead
                        //
                        // Note: If we ever introduce sub categories in the gcode scripts
                        // here (more _ after the prefix), we'll need to adjust this code
                        // to be able to cope with that, right now it only strips the prefix
                        // and uses the rest as key in the result, no recursive translation
                        // is done!
                        var result = {};
                        var prefix = "scripts_gcode_";
                        var observables = _.filter(_.keys(self), function(key) { return _.startsWith(key, prefix); });
                        _.each(observables, function(observable) {
                            var script = observable.substring(prefix.length);
                            result[script] = self[observable]();
                        });
                        return result;
                    }
                },
                temperature: {
                    profiles: function() {
                        var result = [];
                        _.each(self.temperature_profiles(), function(profile) {
                            try {
                                result.push({
                                    name: profile.name,
                                    extruder: Math.floor(_.isNumber(profile.extruder) ? profile.extruder : parseInt(profile.extruder)),
                                    bed: Math.floor(_.isNumber(profile.bed) ? profile.bed : parseInt(profile.bed))
                                });
                            } catch (ex) {
                                // ignore
                            }
                        });
                        return result;
                    }
                }
            };

            var mapFromObservables = function(data, mapping, keyPrefix) {
                var flag = false;
                var result = {};

                // process all key-value-pairs here
                _.forOwn(data, function(value, key) {
                    var observable = key;
                    if (keyPrefix != undefined) {
                        observable = keyPrefix + "_" + observable;
                    }

                    if (self.observableCopies.hasOwnProperty(observable)) {
                        // only a copy, skip
                        return;
                    }

                    if (mapping && mapping[key] && _.isFunction(mapping[key])) {
                        result[key] = mapping[key]();
                        flag = true;
                    } else if (_.isPlainObject(value)) {
                        // value is another object, we'll dive deeper
                        var subresult = mapFromObservables(value, (mapping && mapping[key]) ? mapping[key] : undefined, observable);
                        if (subresult != undefined) {
                            // we only set something on our result if we got something back
                            result[key] = subresult;
                            flag = true;
                        }
                    } else if (self.hasOwnProperty(observable)) {
                        result[key] = self[observable]();
                        flag = true;
                    }
                });

                // if we set something on our result (flag is true), we return result, else we return undefined
                return flag ? result : undefined;
            };

            // map local observables based on our existing data
            var dataFromObservables = mapFromObservables(data, specialMappings);

            data = _.extend(data, dataFromObservables);
            return data;
        };

        self.fromResponse = function(response, local) {
            // server side changes to set
            var serverChangedData;

            // client side changes to keep
            var clientChangedData;

            if (local) {
                // local is true, so we'll keep all local changes and only update what's been updated server side
                serverChangedData = getOnlyChangedData(response, self.lastReceivedSettings);
                clientChangedData = getOnlyChangedData(self.getLocalData(), self.lastReceivedSettings);
            } else  {
                // local is false or unset, so we'll forcefully update with the settings from the server
                serverChangedData = response;
                clientChangedData = undefined;
            }

            // last received settings reset to response
            self.lastReceivedSettings = response;

            if (self.settings === undefined) {
                self.settings = ko.mapping.fromJS(serverChangedData);
            } else {
                ko.mapping.fromJS(serverChangedData, self.settings);
            }

            // some special apply functions for various observables
            var specialMappings = {
                appearance: {
                    defaultLanguage: function(value) {
                        self.appearance_defaultLanguage("_default");
                        if (_.includes(self.locale_languages, value)) {
                            self.appearance_defaultLanguage(value);
                        }
                    }
                },
                feature: {
                    autoUppercaseBlacklist: function(value) { self.feature_autoUppercaseBlacklist(value.join(", "))}
                },
                serial: {
                    additionalPorts : function(value) { self.serial_additionalPorts(value.join("\n"))},
                    additionalBaudrates: function(value) { self.serial_additionalBaudrates(value.join(", "))},
                    longRunningCommands: function(value) { self.serial_longRunningCommands(value.join(", "))},
                    checksumRequiringCommands: function(value) { self.serial_checksumRequiringCommands(value.join(", "))},
                    externalHeatupDetection: function(value) { self.serial_disableExternalHeatupDetection(!value) },
                    alwaysSendChecksum: function(value) { if (value) { self.serial_sendChecksum("always")}},
                    neverSendChecksum: function(value) { if (value) { self.serial_sendChecksum("never")}},
                    ignoreErrorsFromFirmware: function(value) { if (value) {self.serial_serialErrorBehaviour("ignore")}},
                    disconnectOnErrors: function(value) { if (value) {self.serial_serialErrorBehaviour("disconnect")}}
                },
                terminalFilters: function(value) { self.terminalFilters($.extend(true, [], value)) },
                temperature: {
                    profiles: function(value) { self.temperature_profiles($.extend(true, [], value)); }
                }
            };

            var mapToObservables = function(data, mapping, local, keyPrefix) {
                if (!_.isPlainObject(data)) {
                    return;
                }

                // process all key-value-pairs here
                _.forOwn(data, function(value, key) {
                    var observable = key;
                    if (keyPrefix != undefined) {
                        observable = keyPrefix + "_" + observable;
                    }

                    if (self.observableCopies.hasOwnProperty(observable)) {
                        // only a copy, skip
                        return;
                    }

                    var haveLocalVersion = local && local.hasOwnProperty(key);

                    if (mapping && mapping[key] && _.isFunction(mapping[key]) && !haveLocalVersion) {
                        // if we have a custom apply function for this, we'll use it
                        mapping[key](value);
                    } else if (_.isPlainObject(value)) {
                        // value is another object, we'll dive deeper
                        mapToObservables(value, (mapping && mapping[key]) ? mapping[key] : undefined, (local && local[key]) ? local[key] : undefined, observable);
                    } else if (!haveLocalVersion && self.hasOwnProperty(observable)) {
                        // if we have a matching observable, we'll use that
                        self[observable](value);
                    }
                });
            };

            mapToObservables(serverChangedData, specialMappings, clientChangedData);

            firstRequest.resolve();
        };

        self.cancelData = function () {
            // revert unsaved changes
            self.fromResponse(self.lastReceivedSettings);

            self.hide();
        }

        self.saveData = function (data, successCallback, setAsSending) {
            var options;
            if (_.isPlainObject(successCallback)) {
                options = successCallback;
            } else {
                options = {
                    success: successCallback,
                    sending: (setAsSending == true)
                }
            }

            self.settingsDialog.trigger("beforeSave");

            self.sawUpdateEventWhileSending = false;
            self.sending(data == undefined || options.sending || false);

            if (data == undefined) {
                // we also only send data that actually changed when no data is specified
                data = getOnlyChangedData(self.getLocalData(), self.lastReceivedSettings);
            }

            self.active = true;
            return OctoPrint.settings.save(data)
                .done(function(data, status, xhr) {
                    self.ignoreNextUpdateEvent = !self.sawUpdateEventWhileSending;
                    self.active = false;

                    self.receiving(true);
                    self.sending(false);

                    try {
                        self.fromResponse(data);
                        if (options.success) options.success(data, status, xhr);
                    } finally {
                        self.receiving(false);
                    }
                })
                .fail(function(xhr, status, error) {
                    self.sending(false);
                    self.active = false;
                    if (options.error) options.error(xhr, status, error);
                })
                .always(function(xhr, status) {
                    if (options.complete) options.complete(xhr, status);
                });
        };

        self.onEventSettingsUpdated = function() {
            if (self.active) {
                self.sawUpdateEventWhileActive = true;
            }

            var preventSettingsRefresh = _.any(self.allViewModels, function(viewModel) {
                if (viewModel.hasOwnProperty("onSettingsPreventRefresh")) {
                    try {
                        return viewModel["onSettingsPreventRefresh"]();
                    } catch (e) {
                        log.warn("Error while calling onSettingsPreventRefresh on", viewModel, ":", e);
                        return false;
                    }
                } else {
                    return false;
                }
            });

            if (preventSettingsRefresh) {
                // if any of our viewmodels prevented this refresh, we'll just return now
                return;
            }

            if (self.isDialogActive()) {
                // dialog is open and not currently busy...
                if (self.sending() || self.receiving() || self.active || self.ignoreNextUpdateEvent) {
                    self.ignoreNextUpdateEvent = false;
                    return;
                }

                if (!hasDataChanged(self.getLocalData(), self.lastReceivedSettings)) {
                    // we don't have local changes, so just fetch new data
                    self.requestData();
                } else {
                    // we have local changes, show update dialog
                    self.settingsUpdatedDialog.modal("show");
                }
            } else {
                // dialog is not open, just fetch new data
                self.requestData();
            }
        };

        self._resetScrollPosition = function() {
            $('#settings_dialog_content', self.settingsDialog).scrollTop(0);

            // also reset any contained tabs/pills/lists to first pane
            $('#settings_dialog_content ul.nav-pills a[data-toggle="tab"]:first', self.settingsDialog).tab("show");
            $('#settings_dialog_content ul.nav-list a[data-toggle="tab"]:first', self.settingsDialog).tab("show");
            $('#settings_dialog_content ul.nav-tabs a[data-toggle="tab"]:first', self.settingsDialog).tab("show");
        };

        self.selectTab = function(tab) {
            if (tab != undefined) {
                if (!_.startsWith(tab, "#")) {
                    tab = "#" + tab;
                }
                $('ul.nav-list a[href="' + tab + '"]', self.settingsDialog).tab("show");
            } else {
                $('ul.nav-list a[data-toggle="tab"]:first', self.settingsDialog).tab("show");
            }
        };

        self.onServerReconnect = function() {
            // the settings might have changed if the server was just restarted,
            // better refresh them now
            self.requestData();
        };

        self.onUserLoggedIn = function() {
            // we might have other user rights now, refresh (but only if startup has fully completed)
            if (!self._startupComplete) return;
            self.requestData();
        };

        self.onUserLoggedOut = function() {
            // we might have other user rights now, refresh (but only if startup has fully completed)
            if (!self._startupComplete) return;
            self.requestData();
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: SettingsViewModel,
        dependencies: ["loginStateViewModel", "usersViewModel", "printerProfilesViewModel", "aboutViewModel"],
        elements: ["#settings_dialog", "#navbar_settings"]
    });
});

;

// source: js/app/viewmodels/slicing.js
$(function() {
    function SlicingViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.printerProfiles = parameters[1];
        self.printerState = parameters[2];

        self.file = ko.observable(undefined);
        self.target = undefined;
        self.path = undefined;
        self.data = undefined;

        self.defaultSlicer = undefined;
        self.defaultProfile = undefined;

        self.destinationFilename = ko.observable();
        self.gcodeFilename = self.destinationFilename; // TODO: for backwards compatibility, mark deprecated ASAP

        self.title = ko.observable();
        self.slicer = ko.observable();
        self.slicers = ko.observableArray();
        self.profile = ko.observable();
        self.profiles = ko.observableArray();
        self.printerProfile = ko.observable();

        self.slicerSameDevice = ko.observable();

        self.allViewModels = undefined;

        self.slicersForFile = function(file) {
            if (file === undefined) {
                return [];
            }

            return _.filter(self.configuredSlicers(), function(slicer) {
                return _.any(slicer.sourceExtensions, function(extension) {
                    return _.endsWith(file.toLowerCase(), "." + extension.toLowerCase());
                });
            });
        };

        self.profilesForSlicer = function(key) {
            if (key == undefined) {
                key = self.slicer();
            }
            if (key == undefined || !self.data.hasOwnProperty(key)) {
                return;
            }
            var slicer = self.data[key];

            var selectedProfile = undefined;
            self.profiles.removeAll();
            _.each(_.values(slicer.profiles), function(profile) {
                var name = profile.displayName;
                if (name == undefined) {
                    name = profile.key;
                }

                if (profile.default) {
                    selectedProfile = profile.key;
                }

                self.profiles.push({
                    key: profile.key,
                    name: name
                })
            });

            self.profile(selectedProfile);
            self.defaultProfile = selectedProfile;
        };

        self.resetProfiles = function() {
            self.profiles.removeAll();
            self.profile(undefined);
        };

        self.metadataForSlicer = function(key) {
            if (key == undefined || !self.data.hasOwnProperty(key)) {
                return;
            }

            var slicer = self.data[key];
            self.slicerSameDevice(slicer.sameDevice);
        };

        self.resetMetadata = function() {
            self.slicerSameDevice(true);
        };

        self.configuredSlicers = ko.pureComputed(function() {
            return _.filter(self.slicers(), function(slicer) {
                return slicer.configured;
            });
        });

        self.matchingSlicers = ko.computed(function() {
            var slicers = self.slicersForFile(self.file());

            var containsSlicer = function(key) {
                return _.any(slicers, function(slicer) {
                    return slicer.key == key;
                });
            };

            var current = self.slicer();
            if (!containsSlicer(current)) {
                if (self.defaultSlicer !== undefined && containsSlicer(self.defaultSlicer)) {
                    self.slicer(self.defaultSlicer);
                } else {
                    self.slicer(undefined);
                    self.resetProfiles();
                }
            } else {
                self.profilesForSlicer(self.slicer());
            }

            return slicers;
        });

        self.afterSlicingOptions = [
            {"value": "none", "text": gettext("Do nothing")},
            {"value": "select", "text": gettext("Select for printing")},
            {"value": "print", "text": gettext("Start printing")}
        ];
        self.afterSlicing = ko.observable("none");

        self.show = function(target, file, force, path, options) {
            options = options || {};

            if (!self.enableSlicingDialog() && !force) {
                return;
            }

            var filename = file;
            if (filename.lastIndexOf("/") != 0) {
                path = path || filename.substr(0, filename.lastIndexOf("/"));
                filename = filename.substr(filename.lastIndexOf("/") + 1);
            }

            var display = options.display || filename;
            var destination = display.substr(0, display.lastIndexOf("."));

            self.requestData();
            self.target = target;
            self.file(file);
            self.path = path;
            self.title(_.sprintf(gettext("Slicing %(filename)s"), {filename: display}));
            self.destinationFilename(destination);
            self.printerProfile(self.printerProfiles.currentProfile());
            self.afterSlicing("none");

            $("#slicing_configuration_dialog").modal("show");
        };

        self.slicer.subscribe(function(newValue) {
            if (newValue === undefined) {
                self.resetProfiles();
                self.resetMetadata();
            } else {
                self.profilesForSlicer(newValue);
                self.metadataForSlicer(newValue);
            }
        });

        self.enableSlicingDialog = ko.pureComputed(function() {
            return self.configuredSlicers().length > 0;
        });

        self.enableSlicingDialogForFile = function(file) {
            return self.slicersForFile(file).length > 0;
        };

        self.enableSliceButton = ko.pureComputed(function() {
            return self.destinationFilename() != undefined
                && self.destinationFilename().trim() != ""
                && self.slicer() != undefined
                && self.profile() != undefined
                && (!(self.printerState.isPrinting() || self.printerState.isPaused()) || !self.slicerSameDevice());
        });

        self.sliceButtonTooltip = ko.pureComputed(function() {
            if (!self.enableSliceButton()) {
                if ((self.printerState.isPrinting() || self.printerState.isPaused()) && self.slicerSameDevice()) {
                    return gettext("Cannot slice on the same device while printing");
                } else {
                    return gettext("Cannot slice, not all parameters specified");
                }
            } else {
                return gettext("Start the slicing process");
            }
        });

        self.requestData = function() {
            return OctoPrint.slicing.listAllSlicersAndProfiles()
                .done(function(data) {
                    self.fromResponse(data);
                });
        };

        self.destinationExtension = ko.pureComputed(function() {
            var fallback = "???";
            if (self.slicer() === undefined) {
                return fallback;
            }
            var slicer = self.data[self.slicer()];
            if (slicer === undefined) {
                return fallback;
            }
            var extensions = slicer.extensions;
            if (extensions === undefined) {
                return fallback;
            }
            var destinationExtensions = extensions.destination;
            if (destinationExtensions === undefined || !destinationExtensions.length) {
                return fallback;
            }

            return destinationExtensions[0] || fallback;
        });

        self.fromResponse = function(data) {
            self.data = data;

            var selectedSlicer = undefined;
            self.slicers.removeAll();
            _.each(_.values(data), function(slicer) {
                var name = slicer.displayName;
                if (name == undefined) {
                    name = slicer.key;
                }

                if (slicer.default && slicer.configured) {
                    selectedSlicer = slicer.key;
                }

                var props = {
                    key: slicer.key,
                    name: name,
                    configured: slicer.configured,
                    sourceExtensions: slicer.extensions.source,
                    destinationExtensions: slicer.extensions.destination,
                    sameDevice: slicer.sameDevice
                };
                self.slicers.push(props);
            });

            self.defaultSlicer = selectedSlicer;

            if (self.allViewModels) {
                callViewModels(self.allViewModels, "onSlicingData", [data]);
            }
        };

        self.slice = function() {
            if (!self.enableSliceButton()) {
                return;
            }

            var destinationFilename = self.destinationFilename();

            var destinationExtensions = self.data[self.slicer()] && self.data[self.slicer()].extensions && self.data[self.slicer()].extensions.destination
                                        ? self.data[self.slicer()].extensions.destination
                                        : ["???"];
            if (!_.any(destinationExtensions, function(extension) {
                    return _.endsWith(destinationFilename.toLowerCase(), "." + extension.toLowerCase());
                })) {
                destinationFilename = destinationFilename + "." + destinationExtensions[0];
            }

            var data = {
                slicer: self.slicer(),
                profile: self.profile(),
                printerProfile: self.printerProfile(),
                destination: destinationFilename
            };

            if (self.path != undefined) {
                data["path"] = self.path;
            }

            if (self.afterSlicing() == "print") {
                data["print"] = true;
            } else if (self.afterSlicing() == "select") {
                data["select"] = true;
            }

            OctoPrint.files.slice(self.target, self.file(), data)
                .done(function() {
                    $("#slicing_configuration_dialog").modal("hide");

                    self.destinationFilename(undefined);
                    self.slicer(self.defaultSlicer);
                    self.profile(self.defaultProfile);
                });
        };

        self._sanitize = function(name) {
            return name.replace(/[^a-zA-Z0-9\-_\.\(\) ]/g, "").replace(/ /g, "_");
        };

        self.onStartup = function() {
            self.requestData();
        };

        self.onEventSettingsUpdated = function(payload) {
            self.requestData();
        };

        self.onAllBound = function(allViewModels) {
            self.allViewModels = allViewModels;
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: SlicingViewModel,
        dependencies: ["loginStateViewModel", "printerProfilesViewModel", "printerStateViewModel"],
        elements: ["#slicing_configuration_dialog"]
    });
});

;

// source: js/app/viewmodels/system.js
$(function() {
    function SystemViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];

        self.lastCommandResponse = undefined;
        self.systemActions = ko.observableArray([]);

        self.requestData = function() {
            self.requestCommandData();
        };

        self.requestCommandData = function() {
            if (!self.loginState.isAdmin()) {
                return $.Deferred().reject().promise();
            }

            return OctoPrint.system.getCommands()
                .done(self.fromCommandResponse);
        };

        self.fromCommandResponse = function(response) {
            var actions = [];
            if (response.core && response.core.length) {
                _.each(response.core, function(data) {
                    var action = _.extend({}, data);
                    action.actionSource = "core";
                    actions.push(action);
                });
                if (response.custom && response.custom.length) {
                    actions.push({action: "divider"});
                }
            }
            _.each(response.custom, function(data) {
                var action = _.extend({}, data);
                action.actionSource = "custom";
                actions.push(action);
            });
            self.lastCommandResponse = response;
            self.systemActions(actions);
        };

        self.triggerCommand = function(commandSpec) {
            var deferred = $.Deferred();

            var callback = function() {
                OctoPrint.system.executeCommand(commandSpec.actionSource, commandSpec.action)
                    .done(function() {
                        var text;
                        if (commandSpec.async) {
                            text = gettext("The command \"%(command)s\" was triggered asynchronously");
                        } else {
                            text = gettext("The command \"%(command)s\" executed successfully");
                        }

                        new PNotify({
                            title: "Success",
                            text: _.sprintf(text, {command: commandSpec.name}),
                            type: "success"
                        });
                        deferred.resolve(["success", arguments]);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        if (!commandSpec.hasOwnProperty("ignore") || !commandSpec.ignore) {
                            var error = "<p>" + _.sprintf(gettext("The command \"%(command)s\" could not be executed."), {command: commandSpec.name}) + "</p>";
                            error += pnotifyAdditionalInfo("<pre>" + jqXHR.responseText + "</pre>");
                            new PNotify({title: gettext("Error"), text: error, type: "error", hide: false});
                            deferred.reject(["error", arguments]);
                        } else {
                            deferred.resolve(["ignored", arguments]);
                        }
                    });
            };

            if (commandSpec.confirm) {
                showConfirmationDialog({
                    message: commandSpec.confirm,
                    onproceed: function() {
                        callback();
                    },
                    oncancel: function() {
                        deferred.reject("cancelled", arguments);
                    }
                });
            } else {
                callback();
            }

            return deferred.promise();
        };

        self.onUserLoggedIn = function(user) {
            if (user.admin) {
                self.requestData();
            } else {
                self.onUserLoggedOut();
            }
        };

        self.onUserLoggedOut = function() {
            self.lastCommandResponse = undefined;
            self.systemActions([]);
        };

        self.onEventSettingsUpdated = function() {
            if (self.loginState.isAdmin()) {
                self.requestData();
            }
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: SystemViewModel,
        dependencies: ["loginStateViewModel"]
    });
});

;

// source: js/app/viewmodels/temperature.js
$(function() {
    function TemperatureViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settingsViewModel = parameters[1];

        self._createToolEntry = function() {
            var entry = {
                name: ko.observable(),
                key: ko.observable(),
                actual: ko.observable(0),
                target: ko.observable(0),
                offset: ko.observable(0),
                newTarget: ko.observable(),
                newOffset: ko.observable()
            };

            entry.newTargetValid = ko.pureComputed(function() {
                var value = entry.newTarget();

                try {
                    value = parseInt(value);
                } catch (exc) {
                    return false;
                }

                return (value >= 0 && value <= 999);
            });

            entry.newOffsetValid = ko.pureComputed(function() {
                var value = entry.newOffset();

                try {
                    value = parseInt(value);
                } catch (exc) {
                    return false;
                }

                return (-50 <= value <= 50);
            });

            entry.offset.subscribe(function(newValue) {
                if (self.changingOffset.item !== undefined && self.changingOffset.item.key() === entry.key()) {
                    // if our we currently have the offset dialog open for this entry and the offset changed
                    // meanwhile, update the displayed value in the dialog
                    self.changingOffset.offset(newValue);
                }
            });

            return entry;
        };

        self.changingOffset = {
            offset: ko.observable(0),
            newOffset: ko.observable(0),
            name: ko.observable(""),
            item: undefined,

            title: ko.pureComputed(function() {
                return _.sprintf(gettext("Changing Offset of %(name)s"), {name: self.changingOffset.name()});
            }),
            description: ko.pureComputed(function() {
                return _.sprintf(gettext("Use the form below to specify a new offset to apply to all temperature commands sent from printed files for \"%(name)s\""),
                    {name: self.changingOffset.name()});
            })
        };
        self.changeOffsetDialog = undefined;

        self.tools = ko.observableArray([]);

        self.hasBed = ko.observable(true);

        self.bedTemp = self._createToolEntry();
        self.bedTemp["name"](gettext("Bed"));
        self.bedTemp["key"]("bed");

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.temperature_profiles = self.settingsViewModel.temperature_profiles;
        self.temperature_cutoff = self.settingsViewModel.temperature_cutoff;

        self.heaterOptions = ko.observable({});

        self._printerProfileInitialized = false;
        self._currentTemperatureDataBacklog = [];
        self._historyTemperatureDataBacklog = [];

        self._printerProfileUpdated = function() {
            var graphColors = ["red", "orange", "green", "brown", "purple"];
            var heaterOptions = {};
            var tools = [];
            var color;

            // tools
            var currentProfileData = self.settingsViewModel.printerProfiles.currentProfileData();
            var numExtruders = (currentProfileData ? currentProfileData.extruder.count() : 0);
            var sharedNozzle = (currentProfileData ? currentProfileData.extruder.sharedNozzle() : false);
            if (numExtruders && numExtruders > 1 && !sharedNozzle) {
                // multiple extruders
                for (var extruder = 0; extruder < numExtruders; extruder++) {
                    color = graphColors.shift();
                    if (!color) color = "black";
                    heaterOptions["tool" + extruder] = {name: "T" + extruder, color: color};

                    if (tools.length <= extruder || !tools[extruder]) {
                        tools[extruder] = self._createToolEntry();
                    }
                    tools[extruder]["name"](gettext("Tool") + " " + extruder);
                    tools[extruder]["key"]("tool" + extruder);
                }
            } else if (numExtruders === 1 || sharedNozzle) {
                // only one extruder, no need to add numbers
                color = graphColors[0];
                heaterOptions["tool0"] = {name: "T", color: color};

                if (tools.length < 1 || !tools[0]) {
                    tools[0] = self._createToolEntry();
                }
                tools[0]["name"](gettext("Tool"));
                tools[0]["key"]("tool0");
            }

            // print bed
            if (currentProfileData && currentProfileData.heatedBed()) {
                self.hasBed(true);
                heaterOptions["bed"] = {name: gettext("Bed"), color: "blue"};
            } else {
                self.hasBed(false);
            }

            // write back
            self.heaterOptions(heaterOptions);
            self.tools(tools);

            if (!self._printerProfileInitialized) {
                self._triggerBacklog();
            }
            self.updatePlot();
        };
        self.settingsViewModel.printerProfiles.currentProfileData.subscribe(function() {
            self._printerProfileUpdated();
            self.settingsViewModel.printerProfiles.currentProfileData().extruder.count.subscribe(self._printerProfileUpdated);
            self.settingsViewModel.printerProfiles.currentProfileData().extruder.sharedNozzle.subscribe(self._printerProfileUpdated);
            self.settingsViewModel.printerProfiles.currentProfileData().heatedBed.subscribe(self._printerProfileUpdated);
        });

        self.temperatures = [];

        self.plot = undefined;
        self.plotHoverPos = undefined;
        self.plotLegendTimeout = undefined;

        self.fromCurrentData = function(data) {
            self._processStateData(data.state);
            if (!self._printerProfileInitialized) {
                self._currentTemperatureDataBacklog.push(data);
            } else {
                self._processTemperatureUpdateData(data.serverTime, data.temps);
            }
            self._processOffsetData(data.offsets);
        };

        self.fromHistoryData = function(data) {
            self._processStateData(data.state);
            if (!self._printerProfileInitialized) {
                self._historyTemperatureDataBacklog.push(data);
            } else {
                self._processTemperatureHistoryData(data.serverTime, data.temps);
            }
            self._processOffsetData(data.offsets);
        };

        self._triggerBacklog = function() {
            _.each(self._historyTemperatureDataBacklog, function(data) {
                self._processTemperatureHistoryData(data.serverTime, data.temps);
            });
            _.each(self._currentTemperatureDataBacklog, function(data) {
                self._processTemperatureUpdateData(data.serverTime, data.temps);
            });
            self._historyTemperatureDataBacklog = [];
            self._currentTemperatureDataBacklog = [];
            self._printerProfileInitialized = true;
        };

        self._processStateData = function(data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };

        self._processTemperatureUpdateData = function(serverTime, data) {
            if (data.length === 0)
                return;

            var lastData = data[data.length - 1];

            var tools = self.tools();
            for (var i = 0; i < tools.length; i++) {
                if (lastData.hasOwnProperty("tool" + i)) {
                    tools[i]["actual"](lastData["tool" + i].actual);
                    tools[i]["target"](lastData["tool" + i].target);
                } else {
                    tools[i]["actual"](0);
                    tools[i]["target"](0);
                }
            }

            if (lastData.hasOwnProperty("bed")) {
                self.bedTemp["actual"](lastData.bed.actual);
                self.bedTemp["target"](lastData.bed.target);
            } else {
                self.bedTemp["actual"](0);
                self.bedTemp["target"](0);
            }

            if (!CONFIG_TEMPERATURE_GRAPH) return;

            self.temperatures = self._processTemperatureData(serverTime, data, self.temperatures);
            self.updatePlot();
        };

        self._processTemperatureHistoryData = function(serverTime, data) {
            self.temperatures = self._processTemperatureData(serverTime, data);
            self.updatePlot();
        };

        self._processOffsetData = function(data) {
            var tools = self.tools();
            for (var i = 0; i < tools.length; i++) {
                if (data.hasOwnProperty("tool" + i)) {
                    tools[i]["offset"](data["tool" + i]);
                } else {
                    tools[i]["offset"](0);
                }
            }

            if (data.hasOwnProperty("bed")) {
                self.bedTemp["offset"](data["bed"]);
            } else {
                self.bedTemp["offset"](0);
            }
        };

        self._processTemperatureData = function(serverTime, data, result) {
            var types = _.keys(self.heaterOptions());
            var clientTime = Date.now();

            // make sure result is properly initialized
            if (!result) {
                result = {};
            }

            _.each(types, function(type) {
                if (!result.hasOwnProperty(type)) {
                    result[type] = {actual: [], target: []};
                }
                if (!result[type].hasOwnProperty("actual")) result[type]["actual"] = [];
                if (!result[type].hasOwnProperty("target")) result[type]["target"] = [];
            });

            // convert data
            _.each(data, function(d) {
                var timeDiff = (serverTime - d.time) * 1000;
                var time = clientTime - timeDiff;
                _.each(types, function(type) {
                    if (!d[type]) return;
                    result[type].actual.push([time, d[type].actual]);
                    result[type].target.push([time, d[type].target]);
                })
            });

            var temperature_cutoff = self.temperature_cutoff();
            if (temperature_cutoff !== undefined) {
                var filterOld = function(item) {
                    return item[0] >= clientTime - temperature_cutoff * 60 * 1000;
                };

                _.each(_.keys(self.heaterOptions()), function(d) {
                    result[d].actual = _.filter(result[d].actual, filterOld);
                    result[d].target = _.filter(result[d].target, filterOld);
                });
            }

            return result;
        };

        self.updatePlot = function() {
            var graph = $("#temperature-graph");
            if (!graph.length) return; // no graph
            if (!self.plot) return; // plot not yet initialized

            var plotInfo = self._getPlotInfo();
            if (plotInfo === undefined) return;

            var newMax = Math.max(Math.max.apply(null, plotInfo.max) * 1.1, 310);
            if (newMax !== self.plot.getAxes().yaxis.max) {
                // re-init (because flot apparently has NO way to change the max value of an axes :/)
                self._initializePlot(true, plotInfo);
            } else {
                // update the data
                self.plot.setData(plotInfo.data);
                self.plot.setupGrid();
                self.updateLegend(self._replaceLegendLabel);
                self.plot.draw();
            }
        };

        self._initializePlot = function(force, plotInfo) {
            var graph = $("#temperature-graph");
            if (!graph.length) return; // no graph
            if (self.plot && !force) return; // already initialized

            plotInfo = plotInfo || self._getPlotInfo();
            if (plotInfo === undefined) return;

            // we don't have a plot yet, we need to set stuff up
            var options = {
                yaxis: {
                    min: 0,
                    max: Math.max(Math.max.apply(null, plotInfo.max) * 1.1, 310),
                    ticks: 10,
                    tickFormatter: function(val, axis) {
                        if (val === undefined || val === 0)
                            return "";
                        return val + "°C";
                    }
                },
                xaxis: {
                    mode: "time",
                    minTickSize: [2, "minute"],
                    tickFormatter: function(val, axis) {
                        if (val === undefined || val === 0)
                            return ""; // we don't want to display the minutes since the epoch if not connected yet ;)

                        // current time in milliseconds in UTC
                        var timestampUtc = Date.now();

                        // calculate difference in milliseconds
                        var diff = timestampUtc - val;

                        // convert to minutes
                        var diffInMins = Math.round(diff / (60 * 1000));
                        if (diffInMins === 0) {
                            // don't write anything for "just now"
                            return "";
                        } else if (diffInMins < 0) {
                            // we can't look into the future
                            return "";
                        } else {
                            return "- " + diffInMins + " " + gettext("min");
                        }
                    }
                },
                legend: {
                    position: "sw",
                    noColumns: 2,
                    backgroundOpacity: 0
                }
            };

            if (!OctoPrint.coreui.browser.mobile) {
                options["crosshair"] = { mode: "x" };
                options["grid"] = { hoverable: true, autoHighlight: false };
            }

            self.plot = $.plot(graph, plotInfo.data, options);
        };

        self._getPlotInfo = function() {
            var data = [];
            var heaterOptions = self.heaterOptions();
            if (!heaterOptions) return undefined;

            var maxTemps = [310/1.1];
            var now = Date.now();

            var showFahrenheit = self._shallShowFahrenheit();

            _.each(_.keys(heaterOptions), function(type) {
                if (type === "bed" && !self.hasBed()) {
                    return;
                }

                var actuals = [];
                var targets = [];

                if (self.temperatures[type]) {
                    actuals = self.temperatures[type].actual;
                    targets = self.temperatures[type].target;
                }

                var actualTemp = actuals && actuals.length ? formatTemperature(actuals[actuals.length - 1][1], showFahrenheit) : "-";
                var targetTemp = targets && targets.length ? formatTemperature(targets[targets.length - 1][1], showFahrenheit) : "-";

                data.push({
                    label: gettext("Actual") + " " + heaterOptions[type].name + ": " + actualTemp,
                    color: heaterOptions[type].color,
                    data: actuals.length ? actuals : [[now, undefined]]
                });
                data.push({
                    label: gettext("Target") + " " + heaterOptions[type].name + ": " + targetTemp,
                    color: pusher.color(heaterOptions[type].color).tint(0.5).html(),
                    data: targets.length ? targets : [[now, undefined]]
                });

                maxTemps.push(self.getMaxTemp(actuals, targets));
            });

            return {max: maxTemps, data: data};
        };

        self.updateLegend = function(replaceLegendLabel) {
            self.plotLegendTimeout = undefined;

            var resetLegend = function() {
                _.each(dataset, function(series, index) {
                    var value = series.data && series.data.length ? series.data[series.data.length - 1][1] : undefined;
                    replaceLegendLabel(index, series, value);
                });
            };

            var pos = self.plotHoverPos;
            if (pos && !OctoPrint.coreui.browser.mobile) {
                // we got a hover position, let's see what we need to do with that

                var i;
                var axes = self.plot.getAxes();
                var dataset = self.plot.getData();

                if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
                    pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
                    // position outside of the graph, show latest temperature in legend
                    resetLegend();
                } else {
                    // position inside the graph, determine temperature at point and display that in the legend
                    _.each(dataset, function(series, index) {
                        for (i = 0; i < series.data.length; i++) {
                            if (series.data[i][0] > pos.x) {
                                break;
                            }
                        }

                        var y;
                        var p1 = series.data[i - 1];
                        var p2 = series.data[i];

                        if (p1 === undefined && p2 === undefined) {
                            y = undefined;
                        } else if (p1 === undefined) {
                            y = p2[1];
                        } else if (p2 === undefined) {
                            y = p1[1];
                        } else {
                            y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
                        }

                        replaceLegendLabel(index, series, y, true);
                    });
                }
            } else {
                resetLegend();
            }

            // update the grid
            self.plot.setupGrid();
        };

        self.getMaxTemp = function(actuals, targets) {
            var maxTemp = 0;
            actuals.forEach(function(pair) {
                if (pair[1] > maxTemp){
                    maxTemp = pair[1];
                }
            });
            targets.forEach(function(pair) {
                if (pair[1] > maxTemp){
                    maxTemp = pair[1];
                }
            });
            return maxTemp;
        };

        self.incrementTarget = function(item) {
            var value = item.newTarget();
            if (value === undefined || (typeof(value) === "string" && value.trim() === "")) {
                value = item.target();
            }
            try {
                value = parseInt(value);
                if (value > 999) return;
                item.newTarget(value + 1);
                self.autosendTarget(item);
            } catch (ex) {
                // do nothing
            }
        };

        self.decrementTarget = function(item) {
            var value = item.newTarget();
            if (value === undefined || (typeof(value) === "string" && value.trim() === "")) {
                value = item.target();
            }
            try {
                value = parseInt(value);
                if (value <= 0) return;
                item.newTarget(value - 1);
                self.autosendTarget(item);
            } catch (ex) {
                // do nothing
            }
        };

        var _sendTimeout = {};

        self.autosendTarget = function(item) {
            if (!self.settingsViewModel.temperature_sendAutomatically()) return;
            var delay = self.settingsViewModel.temperature_sendAutomaticallyAfter() * 1000;

            var name = item.name();
            if (_sendTimeout[name]) {
                window.clearTimeout(_sendTimeout[name]);
            }
            _sendTimeout[name] = window.setTimeout(function() {
                self.setTarget(item);
                delete _sendTimeout[name];
            }, delay);
        };

        self.clearAutosendTarget = function(item) {
            var name = item.name();
            if (_sendTimeout[name]) {
                window.clearTimeout(_sendTimeout[name]);
                delete _sendTimeout[name];
            }
        };

        self.setTarget = function(item, form) {
            var value = item.newTarget();
            if (form !== undefined) {
                $(form).find("input").blur();
            }
            if (value === undefined || (typeof(value) === "string" && value.trim() === "")) return OctoPrintClient.createRejectedDeferred();

            self.clearAutosendTarget(item);
            return self.setTargetToValue(item, value);
        };

        self.setTargetFromProfile = function(item, profile) {
            if (!profile) return OctoPrintClient.createRejectedDeferred();

            self.clearAutosendTarget(item);
            return self.setTargetToValue(item, (item.key() === "bed" ? profile.bed : profile.extruder));
        };

        self.setTargetToZero = function(item) {
            self.clearAutosendTarget(item);
            return self.setTargetToValue(item, 0);
        };

        self.setTargetToValue = function(item, value) {
            self.clearAutosendTarget(item);

            try {
                value = parseInt(value);
            } catch (ex) {
                return OctoPrintClient.createRejectedDeferred();
            }

            if (value < 0 || value > 999) return OctoPrintClient.createRejectedDeferred();

            var onSuccess = function() {
                item.target(value);
                item.newTarget("");
            };

            if (item.key() === "bed") {
                return self._setBedTemperature(value)
                    .done(onSuccess);
            } else {
                return self._setToolTemperature(item.key(), value)
                    .done(onSuccess);
            }
        };

        self.changeOffset = function(item) {
            // copy values
            self.changingOffset.item = item;
            self.changingOffset.name(item.name());
            self.changingOffset.offset(item.offset());
            self.changingOffset.newOffset(item.offset());

            self.changeOffsetDialog.modal("show");
        };

        self.incrementChangeOffset = function() {
            var value = self.changingOffset.newOffset();
            if (value === undefined || (typeof(value) === "string" && value.trim() === "")) value = self.changingOffset.offset();
            try {
                value = parseInt(value);
                if (value >= 50) return;
                self.changingOffset.newOffset(value + 1);
            } catch (ex) {
                // do nothing
            }
        };

        self.decrementChangeOffset = function() {
            var value = self.changingOffset.newOffset();
            if (value === undefined || (typeof(value) === "string" && value.trim() === "")) value = self.changingOffset.offset();
            try {
                value = parseInt(value);
                if (value <= -50) return;
                self.changingOffset.newOffset(value - 1);
            } catch (ex) {
                // do nothing
            }
        };

        self.deleteChangeOffset = function() {
            self.changingOffset.newOffset(0);
        };

        self.confirmChangeOffset = function() {
            var item = self.changingOffset.item;
            item.newOffset(self.changingOffset.newOffset());

            self.setOffset(item)
                .done(function() {
                    self.changeOffsetDialog.modal("hide");

                    // reset
                    self.changingOffset.offset(0);
                    self.changingOffset.newOffset(0);
                    self.changingOffset.name("");
                    self.changingOffset.item = undefined;
                })
        };

        self.setOffset = function(item) {
            var value = item.newOffset();
            if (value === undefined || (typeof(value) === "string" && value.trim() === "")) return OctoPrintClient.createRejectedDeferred();
            return self.setOffsetToValue(item, value);
        };

        self.setOffsetToZero = function(item) {
            return self.setOffsetToValue(item, 0);
        };

        self.setOffsetToValue = function(item, value) {
            try {
                value = parseInt(value);
            } catch (ex) {
                return OctoPrintClient.createRejectedDeferred();
            }

            if (value < -50 || value > 50) return OctoPrintClient.createRejectedDeferred();

            var onSuccess = function() {
                item.offset(value);
                item.newOffset("");
            };

            if (item.key() === "bed") {
                return self._setBedOffset(value)
                    .done(onSuccess);
            } else {
                return self._setToolOffset(item.key(), value)
                    .done(onSuccess);
            }
        };

        self._setToolTemperature = function(tool, temperature) {
            var data = {};
            data[tool] = parseInt(temperature);
            return OctoPrint.printer.setToolTargetTemperatures(data);
        };

        self._setToolOffset = function(tool, offset) {
            var data = {};
            data[tool] = parseInt(offset);
            return OctoPrint.printer.setToolTemperatureOffsets(data);
        };

        self._setBedTemperature = function(temperature) {
            return OctoPrint.printer.setBedTargetTemperature(parseInt(temperature));
        };

        self._setBedOffset = function(offset) {
            return OctoPrint.printer.setBedTemperatureOffset(parseInt(offset));
        };

        self._replaceLegendLabel = function(index, series, value, emph) {
            var showFahrenheit = self._shallShowFahrenheit();

            var temp = formatTemperature(value, showFahrenheit);
            if (emph) {
                temp = "<em>" + temp + "</em>";
            }
            series.label = series.label.replace(/:.*/, ": " + temp);
        };

        self._shallShowFahrenheit = function() {
            return (self.settingsViewModel.settings !== undefined )
                   ? self.settingsViewModel.settings.appearance.showFahrenheitAlso()
                   : false;
        };

        self.handleEnter = function(event, type, item) {
            if (event.keyCode === 13) {
                if (type === "target") {
                    self.setTarget(item)
                        .done(function() {
                            event.target.blur();
                        });
                } else if (type === "offset") {
                    self.confirmChangeOffset();
                }
            }
        };

        self.handleFocus = function(event, type, item) {
            if (type === "target") {
                var value = item.newTarget();
                if (value === undefined || (typeof(value) === "string" && value.trim() === "")) {
                    item.newTarget(item.target());
                }
                window.setTimeout(function() {
                    event.target.select();
                }, 0);
            } else if (type === "offset") {
                window.setTimeout(function() {
                    event.target.select();
                }, 0);
            }
        };

        self.onAfterTabChange = function(current, previous) {
            if (current !== "#temp") {
                return;
            }

            if (!self.plot) {
                self._initializePlot();
            } else {
                self.updatePlot();
            }
        };

        self.onStartup = function() {
            var graph = $("#temperature-graph");
            if (graph.length && !OctoPrint.coreui.browser.mobile) {
                graph.bind("plothover",  function (event, pos, item) {
                    self.plotHoverPos = pos;
                    if (!self.plotLegendTimeout) {
                        self.plotLegendTimeout = window.setTimeout(function() {
                            self.updateLegend(self._replaceLegendLabel)
                        }, 50);
                    }
                });
            }

            self.changeOffsetDialog = $("#change_offset_dialog");
        };

        self.onStartupComplete = function() {
            self._printerProfileUpdated();
        };

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: TemperatureViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#temp", "#change_offset_dialog"]
    });
});

;

// source: js/app/viewmodels/terminal.js
$(function() {
    function TerminalViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];

        self.tabActive = false;
        self.previousScroll = undefined;

        self.log = ko.observableArray([]);
        self.log.extend({ throttle: 500 });
        self.plainLogLines = ko.observableArray([]);
        self.plainLogLines.extend({ throttle: 500 });

        self.buffer = ko.observable(300);
        self.upperLimit = ko.observable(1499);

        self.command = ko.observable(undefined);

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.autoscrollEnabled = ko.observable(true);

        self.filters = self.settings.terminalFilters;
        self.filterRegex = ko.observable();

        self.cmdHistory = [];
        self.cmdHistoryIdx = -1;

        self.enableFancyFunctionality = ko.observable(true);
        self.disableTerminalLogDuringPrinting = ko.observable(false);

        self.acceptableFancyTime = 500;
        self.acceptableUnfancyTime = 300;
        self.reenableTimeout = 5000;

        self.forceFancyFunctionality = ko.observable(false);
        self.forceTerminalLogDuringPrinting = ko.observable(false);

        self.fancyFunctionality = ko.pureComputed(function() {
            return self.enableFancyFunctionality() || self.forceFancyFunctionality();
        });
        self.terminalLogDuringPrinting = ko.pureComputed(function() {
            return !self.disableTerminalLogDuringPrinting() || self.forceTerminalLogDuringPrinting();
        });

        self.displayedLines = ko.pureComputed(function() {
            if (!self.enableFancyFunctionality()) {
                return self.log();
            }

            var regex = self.filterRegex();
            var lineVisible = function(entry) {
                return regex == undefined || !entry.line.match(regex);
            };

            var filtered = false;
            var result = [];
            var lines = self.log();
            _.each(lines, function(entry) {
                if (lineVisible(entry)) {
                    result.push(entry);
                    filtered = false;
                } else if (!filtered) {
                    result.push(self._toInternalFormat("[...]", "filtered"));
                    filtered = true;
                }
            });

            return result;
        });

        self.plainLogOutput = ko.pureComputed(function() {
            if (self.fancyFunctionality()) {
                return;
            }
            return self.plainLogLines().join("\n");
        });

        self.lineCount = ko.pureComputed(function() {
            if (!self.fancyFunctionality()) {
                return;
            }

            var regex = self.filterRegex();
            var lineVisible = function(entry) {
                return regex == undefined || !entry.line.match(regex);
            };

            var lines = self.log();
            var total = lines.length;
            var displayed = _.filter(lines, lineVisible).length;
            var filtered = total - displayed;

            if (filtered > 0) {
                if (total > self.upperLimit()) {
                    return _.sprintf(gettext("showing %(displayed)d lines (%(filtered)d of %(total)d total lines filtered, buffer full)"), {displayed: displayed, total: total, filtered: filtered});
                } else {
                    return _.sprintf(gettext("showing %(displayed)d lines (%(filtered)d of %(total)d total lines filtered)"), {displayed: displayed, total: total, filtered: filtered});
                }
            } else {
                if (total > self.upperLimit()) {
                    return _.sprintf(gettext("showing %(displayed)d lines (buffer full)"), {displayed: displayed});
                } else {
                    return _.sprintf(gettext("showing %(displayed)d lines"), {displayed: displayed});
                }
            }
        });

        self.autoscrollEnabled.subscribe(function(newValue) {
            if (newValue) {
                self.log(self.log.slice(-self.buffer()));
            }
        });

        self.activeFilters = ko.observableArray([]);
        self.activeFilters.subscribe(function(e) {
            self.updateFilterRegex();
        });

        self.blacklist=[];
        self.settings.feature_autoUppercaseBlacklist.subscribe(function(newValue) {
            self.blacklist = splitTextToArray(newValue, ",", true);
        });

        self._reenableFancyTimer = undefined;
        self._reenableUnfancyTimer = undefined;
        self._disableFancy = function(difference) {
            log.warn("Terminal: Detected slow client (needed " + difference + "ms for processing new log data), disabling fancy terminal functionality");
            if (self._reenableFancyTimer) {
                window.clearTimeout(self._reenableFancyTimer);
                self._reenableFancyTimer = undefined;
            }
            self.enableFancyFunctionality(false);
        };
        self._reenableFancy = function(difference) {
            if (self._reenableFancyTimer) return;
            self._reenableFancyTimer = window.setTimeout(function() {
                log.info("Terminal: Client speed recovered, enabling fancy terminal functionality");
                self.enableFancyFunctionality(true);
            }, self.reenableTimeout);
        };
        self._disableUnfancy = function(difference) {
            log.warn("Terminal: Detected very slow client (needed " + difference + "ms for processing new log data), completely disabling terminal output during printing");
            if (self._reenableUnfancyTimer) {
                window.clearTimeout(self._reenableUnfancyTimer);
                self._reenableUnfancyTimer = undefined;
            }
            self.disableTerminalLogDuringPrinting(true);
        };
        self._reenableUnfancy = function() {
            if (self._reenableUnfancyTimer) return;
            self._reenableUnfancyTimer = window.setTimeout(function() {
                log.info("Terminal: Client speed recovered, enabling terminal output during printing");
                self.disableTerminalLogDuringPrinting(false);
            }, self.reenableTimeout);
        };

        self.fromCurrentData = function(data) {
            self._processStateData(data.state);

            var start = new Date().getTime();
            self._processCurrentLogData(data.logs);
            var end = new Date().getTime();
            var difference = end - start;

            if (self.enableFancyFunctionality()) {
                // fancy enabled -> check if we need to disable fancy
                if (difference >= self.acceptableFancyTime) {
                    self._disableFancy(difference);
                }
            } else if (!self.disableTerminalLogDuringPrinting()) {
                // fancy disabled, unfancy not -> check if we need to disable unfancy or re-enable fancy
                if (difference >= self.acceptableUnfancyTime) {
                    self._disableUnfancy(difference);
                } else if (difference < self.acceptableFancyTime / 2.0) {
                    self._reenableFancy(difference);
                }
            } else {
                // fancy & unfancy disabled -> check if we need to re-enable unfancy
                if (difference < self.acceptableUnfancyTime / 2.0) {
                    self._reenableUnfancy(difference);
                }
            }
        };

        self.fromHistoryData = function(data) {
            self._processStateData(data.state);
            self._processHistoryLogData(data.logs);
        };

        self._processCurrentLogData = function(data) {
            var length = self.log().length;
            if (length >= self.upperLimit()) {
                return;
            }

            if (!self.terminalLogDuringPrinting() && self.isPrinting()) {
                var last = self.plainLogLines()[self.plainLogLines().length - 1];
                var disabled = "--- client too slow, log output disabled while printing ---";
                if (last != disabled) {
                    self.plainLogLines.push(disabled);
                }
                return;
            }

            var newData = (data.length + length > self.upperLimit())
                ? data.slice(0, self.upperLimit() - length)
                : data;
            if (!newData) {
                return;
            }

            if (!self.fancyFunctionality()) {
                // lite version of the terminal - text output only
                self.plainLogLines(self.plainLogLines().concat(newData).slice(-self.buffer()));
                self.updateOutput();
                return;
            }

            var newLog = self.log().concat(_.map(newData, function(line) { return self._toInternalFormat(line) }));
            if (newData.length != data.length) {
                var cutoff = "--- too many lines to buffer, cut off ---";
                newLog.push(self._toInternalFormat(cutoff, "cut"));
            }

            if (self.autoscrollEnabled()) {
                // we only keep the last <buffer> entries
                newLog = newLog.slice(-self.buffer());
            }
            self.log(newLog);
            self.updateOutput();
        };

        self._processHistoryLogData = function(data) {
            self.plainLogLines(data);
            self.log(_.map(data, function(line) { return self._toInternalFormat(line) }));
            self.updateOutput();
        };

        self._toInternalFormat = function(line, type) {
            if (type == undefined) {
                type = "line";
            }
            return {line: escapeUnprintableCharacters(line), type: type}
        };

        self._processStateData = function(data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };

        self.updateFilterRegex = function() {
            var filterRegexStr = self.activeFilters().join("|").trim();
            if (filterRegexStr == "") {
                self.filterRegex(undefined);
            } else {
                self.filterRegex(new RegExp(filterRegexStr));
            }
            self.updateOutput();
        };

        self.updateOutput = function() {
            if (self.tabActive && OctoPrint.coreui.browserTabVisible && self.autoscrollEnabled()) {
                self.scrollToEnd();
            }
        };

        self.terminalScrollEvent = _.throttle(function () {
            var container = self.fancyFunctionality() ? $("#terminal-output") : $("#terminal-output-lowfi");
            var pos = container.scrollTop();
            var scrollingUp = self.previousScroll !== undefined && pos < self.previousScroll;

            if (self.autoscrollEnabled() && scrollingUp) {
                var maxScroll = container[0].scrollHeight - container[0].offsetHeight;

                if (pos <= maxScroll ) {
                    self.autoscrollEnabled(false);
                }
            }

            self.previousScroll = pos;
        }, 250);

        self.gotoTerminalCommand = function() {
            // skip if user highlights text.
            var sel = getSelection().toString();
            if (sel) {
                return;
            }

            $("#terminal-command").focus();
        };

        self.toggleAutoscroll = function() {
            self.autoscrollEnabled(!self.autoscrollEnabled());

            if (self.autoscrollEnabled()) {
                self.updateOutput();
            }
        };

        self.selectAll = function() {
            var container = self.fancyFunctionality() ? $("#terminal-output") : $("#terminal-output-lowfi");
            if (container.length) {
                container.selectText();
            }
        };

        self.scrollToEnd = function() {
            var container = self.fancyFunctionality() ? $("#terminal-output") : $("#terminal-output-lowfi");
            if (container.length) {
                container.scrollTop(container[0].scrollHeight);
            }
        };

        self.copyAll = function() {
            var lines;

            if (self.fancyFunctionality()) {
                lines = _.map(self.log(), "line");
            } else {
                lines = self.plainLogLines();
            }

            copyToClipboard(lines.join("\n"));
        };

        // command matching regex
        // (Example output for inputs G0, G1, G28.1, M117 test)
        // - 1: code including optional subcode. Example: G0, G1, G28.1, M117
        // - 2: main code only. Example: G0, G1, G28, M117
        // - 3: sub code, if available. Example: undefined, undefined, .1, undefined
        // - 4: command parameters incl. leading whitespace, if any. Example: "", "", "", " test"
        var commandRe = /^(([gmt][0-9]+)(\.[0-9+])?)(\s.*)?/i;

        self.sendCommand = function() {
            var command = self.command();
            if (!command) {
                return;
            }

            var commandToSend = command;
            var commandMatch = commandToSend.match(commandRe);
            if (commandMatch !== null) {
                var fullCode = commandMatch[1].toUpperCase(); // full code incl. sub code
                var mainCode = commandMatch[2].toUpperCase(); // main code only without sub code

                if (self.blacklist.indexOf(mainCode) < 0 && self.blacklist.indexOf(fullCode) < 0) {
                    // full or main code not on blacklist -> upper case the whole command
                    commandToSend = commandToSend.toUpperCase();
                } else {
                    // full or main code on blacklist -> only upper case that and leave parameters as is
                    commandToSend = fullCode + (commandMatch[4] !== undefined ? commandMatch[4] : "");
                }
            }

            if (commandToSend) {
                OctoPrint.control.sendGcode(commandToSend)
                    .done(function() {
                        self.cmdHistory.push(command);
                        self.cmdHistory.slice(-300); // just to set a sane limit to how many manually entered commands will be saved...
                        self.cmdHistoryIdx = self.cmdHistory.length;
                        self.command("");
                    });
            }
        };

        self.fakeAck = function() {
            OctoPrint.connection.fakeAck();
        };

        self.handleKeyDown = function(event) {
            var keyCode = event.keyCode;

            if (keyCode == 38 || keyCode == 40) {
                if (keyCode == 38 && self.cmdHistory.length > 0 && self.cmdHistoryIdx > 0) {
                    self.cmdHistoryIdx--;
                } else if (keyCode == 40 && self.cmdHistoryIdx < self.cmdHistory.length - 1) {
                    self.cmdHistoryIdx++;
                }

                if (self.cmdHistoryIdx >= 0 && self.cmdHistoryIdx < self.cmdHistory.length) {
                    self.command(self.cmdHistory[self.cmdHistoryIdx]);
                }

                // prevent the cursor from being moved to the beginning of the input field (this is actually the reason
                // why we do the arrow key handling in the keydown event handler, keyup would be too late already to
                // prevent this from happening, causing a jumpy cursor)
                return false;
            }

            // do not prevent default action
            return true;
        };

        self.handleKeyUp = function(event) {
            if (event.keyCode == 13) {
                self.sendCommand();
            }

            // do not prevent default action
            return true;
        };

        self.onAfterTabChange = function(current, previous) {
            self.tabActive = current == "#term";
            self.updateOutput();
        };

        self.onBrowserTabVisibilityChange = function(status) {
            self.updateOutput();
        };

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: TerminalViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#term"]
    });
});

;

// source: js/app/viewmodels/timelapse.js
$(function() {
    function TimelapseViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];

        self.timelapsePopup = undefined;

        self.defaultFps = 25;
        self.defaultPostRoll = 0;
        self.defaultInterval = 10;
        self.defaultRetractionZHop = 0;
        self.defaultMinDelay = 5.0;

        self.timelapseType = ko.observable(undefined);
        self.timelapseTimedInterval = ko.observable(self.defaultInterval);
        self.timelapsePostRoll = ko.observable(self.defaultPostRoll);
        self.timelapseFps = ko.observable(self.defaultFps);
        self.timelapseRetractionZHop = ko.observable(self.defaultRetractionZHop);
        self.timelapseMinDelay = ko.observable(self.defaultMinDelay);

        self.serverConfig = ko.observable();

        self.persist = ko.observable(false);
        self.isDirty = ko.observable(false);

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.markedForFileDeletion = ko.observableArray([]);
        self.markedForUnrenderedDeletion = ko.observableArray([]);

        self.isTemporary = ko.pureComputed(function() {
            return self.isDirty() && !self.persist();
        });

        self.isBusy = ko.pureComputed(function() {
            return self.isPrinting() || self.isPaused();
        });

        self.timelapseTypeSelected = ko.pureComputed(function() {
            return ("off" !== self.timelapseType());
        });
        self.intervalInputEnabled = ko.pureComputed(function() {
            return ("timed" === self.timelapseType());
        });
        self.saveButtonEnabled = ko.pureComputed(function() {
            return self.isDirty() && !self.isPrinting() && self.loginState.isUser();
        });
        self.resetButtonEnabled = ko.pureComputed(function() {
            return self.saveButtonEnabled() && self.serverConfig() !== undefined;
        });

        self.timelapseType.subscribe(function() {
            self.isDirty(true);
        });
        self.timelapseTimedInterval.subscribe(function() {
            self.isDirty(true);
        });
        self.timelapsePostRoll.subscribe(function() {
            self.isDirty(true);
        });
        self.timelapseFps.subscribe(function() {
            self.isDirty(true);
        });
        self.timelapseRetractionZHop.subscribe(function(newValue) {
            self.isDirty(true);
        });
        self.timelapseMinDelay.subscribe(function() {
            self.isDirty(true);
        });
        self.persist.subscribe(function() {
            self.isDirty(true);
        });

        // initialize list helper
        self.listHelper = new ItemListHelper(
            "timelapseFiles",
            {
                "name": function(a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase()) return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase()) return 1;
                    return 0;
                },
                "date": function(a, b) {
                    // sorts descending
                    if (a["date"] > b["date"]) return -1;
                    if (a["date"] < b["date"]) return 1;
                    return 0;
                },
                "size": function(a, b) {
                    // sorts descending
                    if (a["bytes"] > b["bytes"]) return -1;
                    if (a["bytes"] < b["bytes"]) return 1;
                    return 0;
                }
            },
            {
            },
            "name",
            [],
            [],
            CONFIG_TIMELAPSEFILESPERPAGE
        );

        // initialize list helper for unrendered timelapses
        self.unrenderedListHelper = new ItemListHelper(
            "unrenderedTimelapseFiles",
            {
                "name": function(a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase()) return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase()) return 1;
                    return 0;
                },
                "creation": function(a, b) {
                    // sorts descending
                    if (a["date"] > b["date"]) return -1;
                    if (a["date"] < b["date"]) return 1;
                    return 0;
                },
                "size": function(a, b) {
                    // sorts descending
                    if (a["bytes"] > b["bytes"]) return -1;
                    if (a["bytes"] < b["bytes"]) return 1;
                    return 0;
                }
            },
            {
            },
            "name",
            [],
            [],
            CONFIG_TIMELAPSEFILESPERPAGE
        );

        self.requestData = function() {
            OctoPrint.timelapse.get(true)
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            var config = response.config;
            if (config === undefined) return;

            // timelapses & unrendered
            self.listHelper.updateItems(response.files);
            self.listHelper.resetPage();
            if (response.unrendered) {
                self.unrenderedListHelper.updateItems(response.unrendered);
                self.unrenderedListHelper.resetPage();
            }

            // timelapse config
            self.fromConfig(response.config);
            self.serverConfig(response.config);
        };

        self.fromConfig = function(config) {
            self.timelapseType(config.type);

            if (config.type === "timed" && config.interval !== undefined && config.interval > 0) {
                self.timelapseTimedInterval(config.interval);
            } else {
                self.timelapseTimedInterval(self.defaultInterval);
            }

            if (config.type === "zchange" && config.retractionZHop !== undefined && config.retractionZHop > 0) {
                self.timelapseRetractionZHop(config.retractionZHop);
            } else {
                self.timelapseRetractionZHop(self.defaultRetractionZHop);
            }

            if (config.type === "zchange" && config.minDelay !== undefined && config.minDelay >= 0) {
                self.timelapseMinDelay(config.minDelay);
            } else {
                self.timelapseMinDelay(self.defaultMinDelay);
            }

            if (config.postRoll !== undefined && config.postRoll >= 0) {
                self.timelapsePostRoll(config.postRoll);
            } else {
                self.timelapsePostRoll(self.defaultPostRoll);
            }

            if (config.fps !== undefined && config.fps > 0) {
                self.timelapseFps(config.fps);
            } else {
                self.timelapseFps(self.defaultFps);
            }

            self.persist(false);
            self.isDirty(false);
        };

        self.fromCurrentData = function(data) {
            self._processStateData(data.state);
        };

        self.fromHistoryData = function(data) {
            self._processStateData(data.state);
        };

        self._processStateData = function(data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };

        self.markFilesOnPage = function() {
            self.markedForFileDeletion(_.uniq(self.markedForFileDeletion().concat(_.map(self.listHelper.paginatedItems(), "name"))));
        };

        self.markAllFiles = function() {
            self.markedForFileDeletion(_.map(self.listHelper.allItems, "name"));
        };

        self.clearMarkedFiles = function() {
            self.markedForFileDeletion.removeAll();
        };

        self.removeFile = function(filename) {
            var perform = function() {
                OctoPrint.timelapse.delete(filename)
                    .done(function() {
                        self.markedForFileDeletion.remove(filename);
                        self.requestData()
                    })
                    .fail(function(jqXHR) {
                        var html = "<p>" + _.sprintf(gettext("Failed to remove timelapse %(name)s.</p><p>Please consult octoprint.log for details.</p>"), {name: filename});
                        html += pnotifyAdditionalInfo('<pre style="overflow: auto">' + jqXHR.responseText + '</pre>');
                        new PNotify({
                            title: gettext("Could not remove timelapse"),
                            text: html,
                            type: "error",
                            hide: false
                        });
                    });
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to delete timelapse file \"%(name)s\"."), {name: filename}),
                                   perform)
        };

        self.removeMarkedFiles = function() {
            var perform = function() {
                self._bulkRemove(self.markedForFileDeletion(), "files")
                    .done(function() {
                        self.markedForFileDeletion.removeAll();
                    });
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to delete %(count)d timelapse files."), {count: self.markedForFileDeletion().length}),
                                   perform);
        };

        self.markUnrenderedOnPage = function() {
            self.markedForUnrenderedDeletion(_.uniq(self.markedForUnrenderedDeletion().concat(_.map(self.unrenderedListHelper.paginatedItems(), "name"))));
        };

        self.markAllUnrendered = function() {
            self.markedForUnrenderedDeletion(_.map(self.unrenderedListHelper.allItems, "name"));
        };

        self.clearMarkedUnrendered = function() {
            self.markedForUnrenderedDeletion.removeAll();
        };

        self.removeUnrendered = function(name) {
            var perform = function() {
                OctoPrint.timelapse.deleteUnrendered(name)
                    .done(function() {
                        self.markedForUnrenderedDeletion.remove(name);
                        self.requestData();
                    });
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to delete unrendered timelapse \"%(name)s\"."), {name: name}),
                                   perform)
        };

        self.removeMarkedUnrendered = function() {
            var perform = function() {
                self._bulkRemove(self.markedForUnrenderedDeletion(), "unrendered")
                    .done(function() {
                        self.markedForUnrenderedDeletion.removeAll();
                    });
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to delete %(count)d unrendered timelapses."), {count: self.markedForUnrenderedDeletion().length}),
                                   perform);
        };

        self._bulkRemove = function(files, type) {
            var title, message, handler;

            if (type === "files") {
                title = gettext("Deleting timelapse files");
                message = _.sprintf(gettext("Deleting %(count)d timelapse files..."), {count: files.length});
                handler = function(filename) {
                    return OctoPrint.timelapse.delete(filename)
                        .done(function() {
                            deferred.notify(_.sprintf(gettext("Deleted %(filename)s..."), {filename: filename}), true);
                        })
                        .fail(function(jqXHR) {
                            var short = _.sprintf(gettext("Deletion of %(filename)s failed, continuing..."), {filename: filename});
                            var long = _.sprintf(gettext("Deletion of %(filename)s failed: %(error)s"), {filename: filename, error: jqXHR.responseText});
                            deferred.notify(short, long, false);
                        });
                }
            } else if (type === "unrendered") {
                title = gettext("Deleting unrendered timelapses");
                message = _.sprintf(gettext("Deleting %(count)d unrendered timelapses..."), {count: files.length});
                handler = function(filename) {
                    return OctoPrint.timelapse.deleteUnrendered(filename)
                        .done(function() {
                            deferred.notify(_.sprintf(gettext("Deleted %(filename)s..."), {filename: filename}), true);
                        })
                        .fail(function() {
                            deferred.notify(_.sprintf(gettext("Deletion of %(filename)s failed, continuing..."), {filename: filename}), false);
                        });
                }
            } else {
                return;
            }

            var deferred = $.Deferred();

            var promise = deferred.promise();

            var options = {
                title: title,
                message: message,
                max: files.length,
                output: true
            };
            showProgressModal(options, promise);

            var requests = [];
            _.each(files, function(filename) {
                var request = handler(filename);
                requests.push(request)
            });
            $.when.apply($, _.map(requests, wrapPromiseWithAlways))
                .done(function() {
                    deferred.resolve();
                    self.requestData();
                });

            return promise;
        };

        self.renderUnrendered = function(name) {
            OctoPrint.timelapse.renderUnrendered(name)
                .done(self.requestData);
        };

        self.save = function() {
            var payload = {
                "type": self.timelapseType(),
                "postRoll": self.timelapsePostRoll(),
                "fps": self.timelapseFps(),
                "save": self.persist()
            };

            if (self.timelapseType() === "timed") {
                payload["interval"] = self.timelapseTimedInterval();
            }

            if (self.timelapseType() === "zchange") {
                payload["retractionZHop"] = self.timelapseRetractionZHop();
                payload["minDelay"] = self.timelapseMinDelay();
            }

            OctoPrint.timelapse.saveConfig(payload)
                .done(self.fromResponse);
        };

        self.reset = function() {
            if (self.serverConfig() === undefined) return;
            self.fromConfig(self.serverConfig());
        };

        self.displayTimelapsePopup = function(options) {
            if (self.timelapsePopup !== undefined) {
                self.timelapsePopup.remove();
            }

            _.extend(options, {
                callbacks: {
                    before_close: function(notice) {
                        if (self.timelapsePopup === notice) {
                            self.timelapsePopup = undefined;
                        }
                    }
                }
            });

            self.timelapsePopup = new PNotify(options);
        };

        self.onDataUpdaterReconnect = function() {
            self.requestData();
        };

        self.onEventPostRollStart = function(payload) {
            var title = gettext("Capturing timelapse postroll");

            var text;
            if (!payload.postroll_duration) {
                text = _.sprintf(gettext("Now capturing timelapse post roll, this will take only a moment..."), format);
            } else {
                var format = {
                    time: moment().add(payload.postroll_duration, "s").format("LT")
                };

                if (payload.postroll_duration > 60) {
                    format.duration = _.sprintf(gettext("%(minutes)d min"), {minutes: payload.postroll_duration / 60});
                    text = _.sprintf(gettext("Now capturing timelapse post roll, this will take approximately %(duration)s (so until %(time)s)..."), format);
                } else {
                    format.duration = _.sprintf(gettext("%(seconds)d sec"), {seconds: payload.postroll_duration});
                    text = _.sprintf(gettext("Now capturing timelapse post roll, this will take approximately %(duration)s..."), format);
                }
            }

            self.displayTimelapsePopup({
                title: title,
                text: text,
                hide: false
            });
        };

        // 3 consecutive capture fails trigger error popup
        self._warnAboutCaptureFailThreshold = 3;
        self._warnAboutCaptureFailCounter = 0;
        self._warnedAboutCaptureFail = false;
        self.onEventPrintStarted = function(payload) {
            self._warnAboutCaptureFailCounter = 0;
            self._warnedAboutCaptureFail = false;
        };
        self.onEventCaptureDone = function(payload) {
            self._warnAboutCaptureFailCounter = 0;
            self._warnedAboutCaptureFail = false;
        };
        self.onEventCaptureFailed = function(payload) {
            self._warnAboutCaptureFailCounter++;
            if (self._warnedAboutCaptureFail || self._warnAboutCaptureFailCounter <= self._warnAboutCaptureFailThreshold) {
                return;
            }
            self._warnedAboutCaptureFail = true;

            var html = "<p>" + gettext("Failed repeatedly to capture timelapse frame from webcam - is the snapshot URL configured correctly and the camera on?");
            html += pnotifyAdditionalInfo('Snapshot URL: <pre style="overflow: auto">' + payload.url + '</pre>Error: <pre style="overflow: auto">' + payload.error + '</pre>');
            new PNotify({
                title: gettext("Could not capture snapshots"),
                text: html,
                type: "error",
                hide: false
            });
        };

        self.onEventMovieRendering = function(payload) {
            self.displayTimelapsePopup({
                title: gettext("Rendering timelapse"),
                text: _.sprintf(gettext("Now rendering timelapse %(movie_prefix)s. Due to performance reasons it is not recommended to start a print job while a movie is still rendering."), payload),
                hide: false
            });
        };

        self.onEventMovieFailed = function(payload) {
            var title, html;

            if (payload.reason === "no_frames") {
                title = gettext("Cannot render timelapse");
                html = "<p>" + _.sprintf(gettext("Rendering of timelapse %(movie_prefix)s is not possible since no frames were captured. Is the snapshot URL configured correctly?"), payload) + "</p>";
            } else if (payload.reason = "returncode") {
                title = gettext("Rendering timelapse failed");
                html = "<p>" + _.sprintf(gettext("Rendering of timelapse %(movie_prefix)s failed with return code %(returncode)s"), payload) + "</p>";
                html += pnotifyAdditionalInfo('<pre style="overflow: auto">' + payload.error + '</pre>');
            } else {
                title = gettext("Rendering timelapse failed");
                html = "<p>" + _.sprintf(gettext("Rendering of timelapse %(movie_prefix)s failed due to an unknown error, please consult the log file"), payload) + "</p>";
            }

            self.displayTimelapsePopup({
                title: title,
                text: html,
                type: "error",
                hide: false
            });
        };

        self.onEventMovieDone = function(payload) {
            self.displayTimelapsePopup({
                title: gettext("Timelapse ready"),
                text: _.sprintf(gettext("New timelapse %(movie_prefix)s is done rendering."), payload),
                type: "success",
                callbacks: {
                    before_close: function(notice) {
                        if (self.timelapsePopup === notice) {
                            self.timelapsePopup = undefined;
                        }
                    }
                }
            });
            self.requestData();
        };

        self.onStartup = function() {
            self.requestData();
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: TimelapseViewModel,
        dependencies: ["loginStateViewModel"],
        elements: ["#timelapse"]
    });
});

;

// source: js/app/viewmodels/users.js
$(function() {
    function UsersViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];

        // initialize list helper
        self.listHelper = new ItemListHelper(
            "users",
            {
                "name": function(a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase()) return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {},
            "name",
            [],
            [],
            CONFIG_USERSPERPAGE
        );

        self.emptyUser = {name: "", admin: false, active: false};

        self.currentUser = ko.observable(self.emptyUser);

        self.editorUsername = ko.observable(undefined);
        self.editorPassword = ko.observable(undefined);
        self.editorRepeatedPassword = ko.observable(undefined);
        self.editorApikey = ko.observable(undefined);
        self.editorAdmin = ko.observable(undefined);
        self.editorActive = ko.observable(undefined);

        self.addUserDialog = undefined;
        self.editUserDialog = undefined;
        self.changePasswordDialog = undefined;

        self.currentUser.subscribe(function(newValue) {
            if (newValue === undefined) {
                self.editorUsername(undefined);
                self.editorAdmin(undefined);
                self.editorActive(undefined);
                self.editorApikey(undefined);
            } else {
                self.editorUsername(newValue.name);
                self.editorAdmin(newValue.admin);
                self.editorActive(newValue.active);
                self.editorApikey(newValue.apikey);
            }
            self.editorPassword(undefined);
            self.editorRepeatedPassword(undefined);
        });

        self.editorPasswordMismatch = ko.pureComputed(function() {
            return self.editorPassword() !== self.editorRepeatedPassword();
        });

        self.requestData = function() {
            if (!CONFIG_ACCESS_CONTROL) return;
            if (!self.loginState.isAdmin()) return;

            OctoPrint.users.list()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            self.listHelper.updateItems(response.users);
        };

        self.showAddUserDialog = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            self.currentUser(undefined);
            self.editorActive(true);
            self.addUserDialog.modal("show");
        };

        self.confirmAddUser = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            var user = {
                name: self.editorUsername(),
                password: self.editorPassword(),
                admin: self.editorAdmin(),
                active: self.editorActive()
            };

            self.addUser(user)
                .done(function() {
                    // close dialog
                    self.currentUser(undefined);
                    self.addUserDialog.modal("hide");
                });
        };

        self.showEditUserDialog = function(user) {
            if (!CONFIG_ACCESS_CONTROL) return;

            var process = function(user) {
                self.currentUser(user);
                self.editUserDialog.modal("show");
            };

            // make sure we have the current user data, see #2534
            OctoPrint.users.get(user.name)
                .done(function(data) {
                    process(data);
                })
                .fail(function() {
                    log.warn("Could not fetch current user data, proceeding with client side data copy");
                    process(user);
                });
        };

        self.confirmEditUser = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            var user = self.currentUser();
            user.active = self.editorActive();
            user.admin = self.editorAdmin();

            self.updateUser(user)
                .done(function() {
                    // close dialog
                    self.currentUser(undefined);
                    self.editUserDialog.modal("hide");
                });
        };

        self.showChangePasswordDialog = function(user) {
            if (!CONFIG_ACCESS_CONTROL) return;

            self.currentUser(user);
            self.changePasswordDialog.modal("show");
        };

        self.confirmChangePassword = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            self.updatePassword(self.currentUser().name, self.editorPassword())
                .done(function() {
                    // close dialog
                    self.currentUser(undefined);
                    self.changePasswordDialog.modal("hide");
                });
        };

        self.confirmGenerateApikey = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            self.generateApikey(self.currentUser().name)
                .done(function(response) {
                    self._updateApikey(response.apikey);
                });
        };

        self.confirmDeleteApikey = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            self.deleteApikey(self.currentUser().name)
                .done(function() {
                    self._updateApikey(undefined);
                });
        };

        self.copyApikey = function() {
            copyToClipboard(self.editorApikey());
        };

        self._updateApikey = function(apikey) {
            self.editorApikey(apikey);
            self.requestData();
        };

        //~~ Framework

        self.onStartup = function() {
            self.addUserDialog = $("#settings-usersDialogAddUser");
            self.editUserDialog = $("#settings-usersDialogEditUser");
            self.changePasswordDialog = $("#settings-usersDialogChangePassword");
        };

        //~~ API calls

        self.addUser = function(user) {
            if (!user) {
                throw OctoPrint.InvalidArgumentError("user must be set");
            }
            if (!self.loginState.isAdmin()) return $.Deferred().reject("You are not authorized to perform this action").promise();

            return OctoPrint.users.add(user)
                .done(self.fromResponse);
        };

        self.removeUser = function(user) {
            if (!user) {
                throw OctoPrint.InvalidArgumentError("user must be set");
            }
            if (!self.loginState.isAdmin()) return $.Deferred().reject("You are not authorized to perform this action").promise();

            if (user.name === self.loginState.username()) {
                // we do not allow to delete ourselves
                new PNotify({
                    title: gettext("Not possible"),
                    text: gettext("You may not delete your own account."),
                    type: "error"
                });
                return $.Deferred().reject("You may not delete your own account").promise();
            }

            return OctoPrint.users.delete(user.name)
                .done(self.fromResponse);
        };

        self.updateUser = function(user) {
            if (!user) {
                throw OctoPrint.InvalidArgumentError("user must be set");
            }

            return OctoPrint.users.update(user.name, user.active, user.admin)
                .done(self.fromResponse);
        };

        self.updatePassword = function(username, password) {
            return OctoPrint.users.changePassword(username, password);
        };

        self.generateApikey = function(username) {
            return OctoPrint.users.generateApiKey(username)
                .done(function() {
                    self.requestData();
                });
        };

        self.deleteApikey = function(username) {
            return OctoPrint.users.resetApiKey(username);
        };

        self.onUserLoggedIn = function(user) {
            self.requestData();
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: UsersViewModel,
        dependencies: ["loginStateViewModel"]
    });
});

;

// source: js/app/viewmodels/usersettings.js
$(function() {
    function UserSettingsViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.users = parameters[1];

        self.userSettingsDialog = undefined;

        var auto_locale = {language: "_default", display: gettext("Site default"), english: undefined};
        self.locales = ko.observableArray([auto_locale].concat(_.sortBy(_.values(AVAILABLE_LOCALES), function(n) {
            return n.display;
        })));
        self.locale_languages = _.keys(AVAILABLE_LOCALES);

        self.access_password = ko.observable(undefined);
        self.access_repeatedPassword = ko.observable(undefined);
        self.access_apikey = ko.observable(undefined);
        self.interface_language = ko.observable(undefined);

        self.currentUser = ko.observable(undefined);
        self.currentUser.subscribe(function(newUser) {
            self.access_password(undefined);
            self.access_repeatedPassword(undefined);
            self.access_apikey(undefined);
            self.interface_language("_default");

            if (newUser !== undefined) {
                self.access_apikey(newUser.apikey);
                if (newUser.settings.hasOwnProperty("interface") && newUser.settings.interface.hasOwnProperty("language")) {
                    self.interface_language(newUser.settings.interface.language);
                }
            }
        });

        self.passwordMismatch = ko.pureComputed(function() {
            return self.access_password() !== self.access_repeatedPassword();
        });

        self.show = function(user) {
            if (!CONFIG_ACCESS_CONTROL) return;

            if (user === undefined) {
                user = self.loginState.currentUser();
            }

            var process = function(user) {
                self.currentUser(user);
                self.userSettingsDialog.modal("show");
            };

            // make sure we have the current user data, see #2534
            OctoPrint.users.get(user.name)
                .done(function(data) {
                    process(data);
                })
                .fail(function() {
                    log.warn("Could not fetch current user data, proceeding with client side data copy");
                    process(user);
                });
        };

        self.save = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            if (self.access_password() && !self.passwordMismatch()) {
                self.users.updatePassword(self.currentUser().name, self.access_password(), function(){});
            }

            var settings = {
                "interface": {
                    "language": self.interface_language()
                }
            };
            self.updateSettings(self.currentUser().name, settings)
                .done(function() {
                    // close dialog
                    self.currentUser(undefined);
                    self.userSettingsDialog.modal("hide");
                    self.loginState.reloadUser();
                });
        };

        self.copyApikey = function() {
            copyToClipboard(self.access_apikey());
        };

        self.generateApikey = function() {
            if (!CONFIG_ACCESS_CONTROL) return;

            var generate = function() {
                self.users.generateApikey(self.currentUser().name)
                    .done(function(response) {
                      self.access_apikey(response.apikey);
                    });
            };

            if (self.access_apikey()) {
                showConfirmationDialog(gettext("This will generate a new API Key. The old API Key will cease to function immediately."),
                    generate);
            } else {
                generate();
            }
        };

        self.deleteApikey = function() {
            if (!CONFIG_ACCESS_CONTROL) return;
            if (!self.access_apikey()) return;

            showConfirmationDialog(gettext("This will delete the API Key. It will cease to to function immediately."), function() {
                self.users.deleteApikey(self.currentUser().name)
                    .done(function() {
                        self.access_apikey(undefined);
                    });
            })
        };

        self.updateSettings = function(username, settings) {
            return OctoPrint.users.saveSettings(username, settings);
        };

        self.saveEnabled = function() {
            return !self.passwordMismatch();
        };

        self.onStartup = function() {
            self.userSettingsDialog = $("#usersettings_dialog");
        };

        self.onAllBound = function(allViewModels) {
            self.userSettingsDialog.on('show', function() {
                callViewModels(allViewModels, "onUserSettingsShown");
            });
            self.userSettingsDialog.on('hidden', function() {
                callViewModels(allViewModels, "onUserSettingsHidden");
            });
        }

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: UserSettingsViewModel,
        dependencies: ["loginStateViewModel", "usersViewModel"],
        elements: ["#usersettings_dialog"]
    });
});

;

// source: js/app/viewmodels/wizard.js
$(function() {
    function WizardViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settingsViewModel = parameters[1];

        self.wizardDialog = undefined;
        self.reloadOverlay = undefined;

        self.allViewModels = undefined;

        self.finishing = false;
        self.wizards = [];

        self.isDialogActive = function() {
            return self.wizardDialog.is(":visible");
        };

        self.showDialog = function() {
            if (!CONFIG_WIZARD || !((CONFIG_FIRST_RUN && !CONFIG_ACCESS_CONTROL_ACTIVE) || self.loginState.isAdmin())) return;

            self.getWizardDetails()
                .done(function(response) {
                    callViewModels(self.allViewModels, "onWizardDetails", [response]);

                    if (!self.isDialogActive()) {
                        self.wizardDialog.modal({
                            minHeight: function() { return Math.max($.fn.modal.defaults.maxHeight() - 80, 250); }
                        }).css({
                            width: 'auto',
                            'margin-left': function() { return -($(this).width() /2); }
                        });
                    }

                    callViewModels(self.allViewModels, "onWizardShow");

                    callViewModels(self.allViewModels, "onBeforeWizardTabChange", [OCTOPRINT_INITIAL_WIZARD, undefined]);
                    callViewModels(self.allViewModels, "onAfterWizardTabChange", [OCTOPRINT_INITIAL_WIZARD]);
                });
        };

        self.closeDialog = function() {
            self.wizardDialog.modal("hide");
        };

        self.onStartup = function() {
            self.wizardDialog = $("#wizard_dialog");
            self.wizardDialog.on('show', function(event) {
                OctoPrint.coreui.wizardOpen = true;
            });
            self.wizardDialog.on('hidden', function(event) {
                OctoPrint.coreui.wizardOpen = false;
            });

            self.reloadOverlay = $("#reloadui_overlay");
        };

        self.onUserLoggedIn = function() {
            self.showDialog();
        };

        self.onAllBound = function(allViewModels) {
            self.allViewModels = allViewModels;
            self.wizardDialog.bootstrapWizard({
                tabClass: "nav nav-list",
                nextSelector: ".button-next",
                previousSelector: ".button-previous",
                finishSelector: ".button-finish",
                onTabClick: function() {
                    // we don't allow clicking on the tabs
                    return false;
                },
                onTabShow: function(tab, navigation, index) {
                    if (index < 0 || tab.length == 0) {
                        return true;
                    }

                    var total = self.wizardDialog.bootstrapWizard("navigationLength");

                    if (index == total) {
                        self.wizardDialog.find(".button-next").hide();
                        self.wizardDialog.find(".button-finish").show().removeClass("disabled");
                    } else {
                        self.wizardDialog.find(".button-finish").hide();
                        self.wizardDialog.find(".button-next").show();
                    }

                    var active = tab[0].id;
                    if (active != undefined) {
                        callViewModels(allViewModels, "onAfterWizardTabChange", [active]);
                    }
                },
                onTabChange: function(tab, navigation, index, nextTabIndex, nextTab) {
                    var current, next;

                    if (index == undefined || index < 0 ||
                        nextTabIndex == undefined || nextTabIndex < 0 ||
                        index == nextTabIndex ||
                        tab.length == 0 || nextTab.length == 0) {
                        // let's ignore that nonsense
                        return;
                    }

                    current = tab[0].id;
                    next = nextTab[0].id;

                    if (current != undefined && next != undefined) {
                        var result = true;
                        callViewModels(allViewModels, "onBeforeWizardTabChange", function(method) {
                            // we want to continue evaluating even if result becomes false
                            result = (method(next, current) !== false) && result;
                        });

                        // also trigger the onWizardTabChange event here which we misnamed and
                        // on which we misordered the parameters on during development but which might
                        // already be used somewhere - log a deprecation warning to console though
                        callViewModels(allViewModels, "onWizardTabChange", function(method, viewModel) {
                            log.warn("View model", viewModel, "is using deprecated callback \"onWizardTabChange\", please change to \"onBeforeWizardTabChange\"");

                            // we want to continue evaluating even if result becomes false
                            result = (method(current, next) !== false) && result;
                        });
                        return result;
                    }
                },
                onFinish: function(tab, navigation, index) {
                    var closeDialog = true;
                    callViewModels(allViewModels, "onBeforeWizardFinish", function(method) {
                        // we don't need to call all methods here, one method saying that
                        // the dialog must not be closed yet is enough to stop
                        //
                        // we evaluate closeDialog first to make sure we don't call
                        // the method once it becomes false
                        closeDialog = closeDialog && (method() !== false);
                    });

                    if (closeDialog) {
                        var reload = false;
                        callViewModels(allViewModels, "onWizardFinish", function(method) {
                            // if any of our methods returns that it wants to reload
                            // we'll need to set reload to true
                            //
                            // order is important here - the method call needs to happen
                            // first, or it won't happen after the reload flag has been
                            // set once due to the || making further evaluation unnecessary
                            // then
                            reload = (method() == "reload") || reload;
                        });
                        self.finishWizard()
                            .done(function() {
                                self.closeDialog();
                                if (reload) {
                                    self.reloadOverlay.show();
                                }
                                callViewModels(allViewModels, "onAfterWizardFinish");
                            });
                    }
                }
            });
            self.showDialog();
        };

        self.getWizardDetails = function() {
            return OctoPrint.wizard.get()
                .done(function(response) {
                    self.wizards = _.filter(_.keys(response), function(key) { return response[key] && response[key]["required"] && !response[key]["ignored"]; });
                });
        };

        self.finishWizard = function() {
            var deferred = $.Deferred();
            self.finishing = true;

            self.settingsViewModel.saveData()
                .done(function() {
                    OctoPrint.wizard.finish(self.wizards)
                        .done(function() {
                            deferred.resolve(arguments);
                        })
                        .fail(function() {
                            deferred.reject(arguments);
                        })
                        .always(function() {
                            self.finishing = false;
                        });
                })
                .fail(function() {
                    deferred.reject(arguments);
                });

            return deferred;
        };

        self.onSettingsPreventRefresh = function() {
            if (!self.finishing && self.isDialogActive()
                && hasDataChanged(self.settingsViewModel.getLocalData(), self.settingsViewModel.lastReceivedSettings)) {
                var preventSettingsRefreshDialog = false;
                callViewModels(self.allViewModels, "onWizardPreventSettingsRefreshDialog", function(method) {
                    // if any of our methods returns that it wants to prevent the dialog
                    // we'll need to set preventSettingsRefreshDialog to true
                    //
                    // order is important here - the method call needs to happen
                    // first, or it won't happen after the flag has been
                    // set once due to the || making further evaluation unnecessary
                    // then
                    preventSettingsRefreshDialog = (method() === true) || preventSettingsRefreshDialog;
                });

                // we have local changes, show update dialog
                if (preventSettingsRefreshDialog) {
                    return false;
                } else {
                    self.settingsViewModel.settingsUpdatedDialog.modal("show");
                    return true;
                }
            }

            return false;
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: WizardViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#wizard_dialog"]
    });
});

;

// source: js/app/viewmodels/about.js
$(function() {
    function AboutViewModel(parameters) {
        var self = this;

        self.aboutDialog = undefined;
        self.aboutContent = undefined;
        self.aboutTabs = undefined;

        self.show = function() {
            $("a:first", self.aboutTabs).tab("show");
            self.aboutContent.scrollTop(0);
            self.aboutDialog.modal({
                minHeight: function() { return Math.max($.fn.modal.defaults.maxHeight() - 80, 250); }
            }).css({
                width: 'auto',
                'margin-left': function() { return -($(this).width() /2); }
            });
            return false;
        };

        self.hide = function() {
            self.aboutDialog.modal("hide");
        };

        self.onStartup = function() {
            self.aboutDialog = $("#about_dialog");
            self.aboutTabs = $("#about_dialog_tabs");
            self.aboutContent = $("#about_dialog_content");

            $('a[data-toggle="tab"]', self.aboutTabs).on("show", function() {
                self.aboutContent.scrollTop(0);
            });
        };

        self.showTab = function(tab) {
            $('a[href="#' + tab + '"]', self.aboutTabs).tab("show");
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: AboutViewModel,
        elements: ["#about_dialog", "#footer_about"]
    });
});

;

// source: plugin/action_command_prompt/js/action_command_prompt.js
$(function() {
    function ActionCommandPromptViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];

        self._modal = undefined;

        self.requestData = function() {
            if (!self.loginState.isUser()) return;

            OctoPrint.plugins.action_command_prompt.get()
                .done(self.fromResponse);
        };

        self.fromResponse = function(data) {
            if (data.hasOwnProperty("text") && data.hasOwnProperty("choices")) {
                self._showPrompt(data.text, data.choices);
            }
        };

        self._showPrompt = function(text, buttons) {
            var opts = {
                title: gettext("Message from your printer"),
                message: text,
                selections: buttons,
                onselect: function(index) {
                    if (index > -1) {
                        self._select(index);
                    }
                },
                onclose: function() {
                    self._modal = undefined;
                }
            };

            self._modal = showSelectionDialog(opts)
        };

        self._select = function(index) {
            OctoPrint.plugins.action_command_prompt.select(index);
        };

        self._closePrompt = function() {
            if (self._modal) {
                self._modal.modal("hide");
            }
        };

        self.onStartupComplete = function() {
            self.requestData();
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (!self.loginState.isUser()) return;
            if (plugin !== "action_command_prompt") {
                return;
            }

            switch (data.action) {
                case "show": {
                    self._showPrompt(data.text, data.choices);
                    break;
                }
                case "close": {
                    self._closePrompt();
                    break;
                }
            }
        }

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: ActionCommandPromptViewModel,
        dependencies: ["loginStateViewModel"]
    });
});

;

// source: plugin/announcements/js/announcements.js
$(function() {
    function AnnouncementsViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];

        self.channels = new ItemListHelper(
            "plugin.announcements.channels",
            {
                "channel": function (a, b) {
                    // sorts ascending
                    if (a["channel"].toLocaleLowerCase() < b["channel"].toLocaleLowerCase()) return -1;
                    if (a["channel"].toLocaleLowerCase() > b["channel"].toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {
            },
            "name",
            [],
            [],
            5
        );

        self.unread = ko.observable();
        self.hiddenChannels = [];
        self.channelNotifications = {};

        self.announcementDialog = undefined;
        self.announcementDialogContent = undefined;
        self.announcementDialogTabs = undefined;

        self.setupTabLink = function(item) {
            $("a[data-toggle='tab']", item).on("show", self.resetContentScroll);
        };

        self.resetContentScroll = function() {
            self.announcementDialogContent.scrollTop(0);
        };

        self.toggleButtonCss = function(data) {
            var icon = data.enabled ? "fa fa-toggle-on" : "fa fa-toggle-off";
            var disabled = (self.enableToggle(data)) ? "" : " disabled";

            return icon + disabled;
        };

        self.toggleButtonTitle = function(data) {
            return data.forced ? gettext("Cannot be toggled") : (data.enabled ? gettext("Disable Channel") : gettext("Enable Channel"));
        };

        self.enableToggle = function(data) {
            return !data.forced;
        };

        self.cleanedLink = function(data) {
            // Strips any query parameters from the link and returns it
            var link = data.link;
            if (!link) return link;

            var queryPos = link.indexOf("?");
            if (queryPos !== -1) {
                link = link.substr(0, queryPos);
            }
            return link;
        };

        self.markRead = function(channel, until, reload) {
            if (!self.loginState.isAdmin()) return;

            reload = !!reload;

            var url = PLUGIN_BASEURL + "announcements/channels/" + channel;

            var payload = {
                command: "read",
                until: until
            };

            $.ajax({
                url: url,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(payload),
                contentType: "application/json; charset=UTF-8",
                success: function() {
                    if (reload) {
                        self.retrieveData()
                    }
                }
            })
        };

        self.toggleChannel = function(channel) {
            if (!self.loginState.isAdmin()) return;

            var url = PLUGIN_BASEURL + "announcements/channels/" + channel;

            var payload = {
                command: "toggle"
            };

            $.ajax({
                url: url,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(payload),
                contentType: "application/json; charset=UTF-8",
                success: function() {
                    self.retrieveData()
                }
            })
        };

        self.refreshAnnouncements = function() {
            self.retrieveData(true);
        };

        self.retrieveData = function(force) {
            if (!self.loginState.isAdmin()) return;

            var url = PLUGIN_BASEURL + "announcements/channels";
            if (force) {
                url += "?force=true";
            }

            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    self.fromResponse(data);
                }
            });
        };

        self.fromResponse = function(data) {
            if (!self.loginState.isAdmin()) return;

            var currentTab = $("li.active a", self.announcementDialogTabs).attr("href");

            var unread = 0;
            var channels = [];
            _.each(data.channels, function(value) {
                value.last = value.data.length ? value.data[0].published : undefined;
                value.count = value.data.length;
                unread += value.unread;
                channels.push(value);
            });
            self.channels.updateItems(channels);
            self.unread(unread);

            self.displayAnnouncements(channels);

            self.selectTab(currentTab);
        };

        self.showAnnouncementDialog = function(channel) {
            if (!self.loginState.isAdmin()) return;

            // lazy load images that still need lazy-loading
            $("#plugin_announcements_dialog_content article img").lazyload();

            self.announcementDialogContent.scrollTop(0);

            if (!self.announcementDialog.hasClass("in")) {
                self.announcementDialog.modal({
                    minHeight: function() { return Math.max($.fn.modal.defaults.maxHeight() - 80, 250); }
                }).css({
                    width: 'auto',
                    'margin-left': function() { return -($(this).width() /2); }
                });
            }

            var tab = undefined;
            if (channel) {
                tab = "#plugin_announcements_dialog_channel_" + channel;
            }
            self.selectTab(tab);

            return false;
        };

        self.selectTab = function(tab) {
            if (tab != undefined) {
                if (!_.startsWith(tab, "#")) {
                    tab = "#" + tab;
                }
                $('a[href="' + tab + '"]', self.announcementDialogTabs).tab("show");
            } else {
                $('a:first', self.announcementDialogTabs).tab("show");
            }
        };

        self.displayAnnouncements = function(channels) {
            if (!self.loginState.isAdmin()) return;

            var displayLimit = self.settings.settings.plugins.announcements.display_limit();
            var maxLength = self.settings.settings.plugins.announcements.summary_limit();

            var cutAfterNewline = function(text) {
                text = text.trim();

                var firstNewlinePos = text.indexOf("\n");
                if (firstNewlinePos > 0) {
                    text = text.substr(0, firstNewlinePos).trim();
                }

                return text;
            };

            var stripParagraphs = function(text) {
                if (_.startsWith(text, "<p>")) {
                    text = text.substr("<p>".length);
                }
                if (_.endsWith(text, "</p>")) {
                    text = text.substr(0, text.length - "</p>".length);
                }

                return text.replace(/<\/p>\s*<p>/ig, "<br>");
            };

            _.each(channels, function(value) {
                var key = value.key;
                var channel = value.channel;
                var priority = value.priority;
                var items = value.data;

                if ($.inArray(key, self.hiddenChannels) > -1) {
                    // channel currently ignored
                    return;
                }

                var newItems = _.filter(items, function(entry) { return !entry.read; });
                if (newItems.length == 0) {
                    // no new items at all, we don't display anything for this channel
                    return;
                }

                var displayedItems;
                if (newItems.length > displayLimit) {
                    displayedItems = newItems.slice(0, displayLimit);
                } else {
                    displayedItems = newItems;
                }
                var rest = newItems.length - displayedItems.length;

                var text = "<ul style='margin-top: 10px; margin-bottom: 10px'>";
                _.each(displayedItems, function(item) {
                    var limitedSummary = stripParagraphs(item.summary_without_images.trim());
                    if (limitedSummary.length > maxLength) {
                        limitedSummary = limitedSummary.substr(0, maxLength);
                        limitedSummary = limitedSummary.substr(0, Math.min(limitedSummary.length, limitedSummary.lastIndexOf(" ")));
                        limitedSummary += "...";
                    }

                    text += "<li><a href='" + item.link + "' target='_blank' rel='noreferrer noopener'>" + cutAfterNewline(item.title) + "</a><br><small>" + formatTimeAgo(item.published) + "</small><p>" + limitedSummary + "</p></li>";
                });
                text += "</ul>";

                if (rest) {
                    text += "<p>"  + gettext(_.sprintf("... and %(rest)d more.", {rest: rest})) + "</p>";
                }

                text += "<small>" + gettext("You can edit your announcement subscriptions under Settings > Announcements.") + "</small>";

                var options = {
                    title: channel,
                    text: text,
                    hide: false,
                    confirm: {
                        confirm: true,
                        buttons: [{
                            text: gettext("Later"),
                            click: function(notice) {
                                notice.remove();
                                self.hiddenChannels.push(key);
                            }
                        }, {
                            text: gettext("Mark read"),
                            click: function(notice) {
                                notice.remove();
                                self.markRead(key, value.last);
                            }
                        }, {
                            text: gettext("Read..."),
                            addClass: "btn-primary",
                            click: function(notice) {
                                notice.remove();
                                self.showAnnouncementDialog(key);
                                self.markRead(key, value.last);
                            }
                        }]
                    },
                    buttons: {
                        sticker: false,
                        closer: false
                    }
                };

                if (priority == 1) {
                    options.type = "error";
                }

                if (self.channelNotifications[key]) {
                    self.channelNotifications[key].remove();
                }
                self.channelNotifications[key] = new PNotify(options);
            });
        };

        self.hideAnnouncements = function() {
            _.each(self.channelNotifications, function(notification, key) {
                notification.remove();
            });
            self.channelNotifications = {};
        };

        self.configureAnnouncements = function() {
            self.settings.show("settings_plugin_announcements");
        };

        self.onUserLoggedIn = function() {
            self.retrieveData();
        };

        self.onUserLoggedOut = function() {
            self.hideAnnouncements();
        };

        self.onStartup = function() {
            self.announcementDialog = $("#plugin_announcements_dialog");
            self.announcementDialogContent = $("#plugin_announcements_dialog_content");
            self.announcementDialogTabs = $("#plugin_announcements_dialog_tabs");
        };

        self.onEventConnectivityChanged = function(payload) {
            if (!payload || !payload.new) return;
            self.retrieveData();
        }

    }

    OCTOPRINT_VIEWMODELS.push({
        construct: AnnouncementsViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#plugin_announcements_dialog", "#settings_plugin_announcements", "#navbar_plugin_announcements"]
    });
});

;

// source: plugin/appkeys/js/appkeys.js
$(function() {
    function UserAppKeysViewModel(parameters) {
        var self = this;
        self.loginState = parameters[0];

        self.keys = new ItemListHelper(
            "plugin.appkeys.userkeys",
            {
                "app": function (a, b) {
                    // sorts ascending
                    if (a["app_id"].toLowerCase() < b["app_id"].toLowerCase()) return -1;
                    if (a["app_id"].toLowerCase() > b["app_id"].toLowerCase()) return 1;
                    return 0;
                }
            },
            {
            },
            "app",
            [],
            [],
            5
        );
        self.pending = {};
        self.openRequests = {};

        self.editorApp = ko.observable();

        self.requestData = function() {
            OctoPrint.plugins.appkeys.getKeys()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            self.keys.updateItems(response.keys);
            self.pending = response.pending;
            _.each(self.pending, function(data, token) {
                self.openRequests[token] = self.promptForAccess(data.app_id, token);
            })
        };

        self.generateKey = function() {
            return OctoPrint.plugins.appkeys.generateKey(self.editorApp())
                .done(self.requestData)
                .done(function() {
                    self.editorApp("");
                });
        };

        self.revokeKey = function(key) {
            var perform = function() {
                OctoPrint.plugins.appkeys.revokeKey(key)
                    .done(self.requestData);
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to revoke the application key \"%(key)s\"."), {key: key}),
                                   perform);
        };

        self.allowApp = function(token) {
            return OctoPrint.plugins.appkeys.decide(token, true)
                .done(self.requestData);
        };

        self.denyApp = function(token) {
            return OctoPrint.plugins.appkeys.decide(token, false)
                .done(self.requestData);
        };

        self.promptForAccess = function(app, token) {
            var message = gettext("\"<strong>%(app)s</strong>\" has requested access to control OctoPrint through the API.");
            message = _.sprintf(message, {app: app});
            message = "<p>" + message + "</p><p>" + gettext("Do you want to allow access to this application with your user account?") + "</p>";
            return new PNotify({
                title: gettext("Access Request"),
                text: message,
                hide: false,
                icon: "fa fa-key",
                confirm: {
                    confirm: true,
                    buttons: [{
                        text: gettext("Allow"),
                        click: function(notice) {
                            self.allowApp(token);
                            notice.remove();
                        }
                    }, {
                        text: gettext("Deny"),
                        click: function(notice) {
                            self.denyApp(token);
                            notice.remove();
                        }
                    }]
                },
                buttons: {
                    sticker: false,
                    closer: false
                }
            });
        };

        self.onUserSettingsShown = function() {
            self.requestData();
        };

        self.onUserLoggedIn = function() {
            self.requestData();
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin !== "appkeys") {
                return;
            }

            var app, token, user;

            if (data.type === "request_access" && self.loginState.isUser()) {
                app = data.app_name;
                token = data.user_token;
                user = data.user_id;

                if (user && user !== self.loginState.username()) {
                    return;
                }

                if (self.pending[token] !== undefined) {
                    return;
                }

                self.openRequests[token] = self.promptForAccess(app, token);

            } else if (data.type === "end_request") {
                token = data.user_token;

                if (self.openRequests[token] !== undefined) {
                    // another instance responded to the access request before the current user did
                    if (self.openRequests[token].state !== "closed") {
                        self.openRequests[token].remove();
                    }
                    delete self.openRequests[token]
                }
            }
        };
    }

    function AllAppKeysViewModel(parameters) {
        var self = this;
        self.loginState = parameters[0];

        self.keys = new ItemListHelper(
            "plugin.appkeys.allkeys",
            {
                "user_app": function (a, b) {
                    // sorts ascending, first by user, then by app
                    if (a["user_id"] > b["user_id"]) return 1;
                    if (a["user_id"] < b["user_id"]) return -1;

                    if (a["app_id"].toLowerCase() > b["app_id"].toLowerCase()) return 1;
                    if (a["app_id"].toLowerCase() < b["app_id"].toLowerCase()) return -1;

                    return 0;
                }
            },
            {
            },
            "user_app",
            [],
            [],
            10
        );
        self.users = ko.observableArray([]);
        self.apps = ko.observableArray([]);

        self.markedForDeletion = ko.observableArray([]);

        self.onSettingsShown = function() {
            self.requestData();
        };

        self.onUserLoggedIn = function() {
            self.requestData();
        };

        self.requestData = function() {
            OctoPrint.plugins.appkeys.getAllKeys()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            self.keys.updateItems(response.keys);

            var users = [];
            var apps = [];
            _.each(response.keys, function(key) {
                users.push(key.user_id);
                apps.push(key.app_id.toLowerCase());
            });

            users = _.uniq(users);
            users.sort();
            self.users(users);

            apps = _.uniq(apps);
            apps.sort();
            self.apps(apps);
        };

        self.revokeKey = function(key) {
            var perform = function() {
                OctoPrint.plugins.appkeys.revokeKey(key)
                    .done(self.requestData);
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to revoke the application key \"%(key)s\"."), {key: key}),
                                   perform);
        };

        self.revokeMarked = function() {
            var perform = function() {
                self._bulkRevoke(self.markedForDeletion())
                    .done(function() {
                        self.markedForDeletion.removeAll();
                    });
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to revoke %(count)d application keys."), {count: self.markedForDeletion().length}),
                                   perform);
        };

        self.markAllOnPageForDeletion = function() {
            self.markedForDeletion(_.uniq(self.markedForDeletion().concat(_.map(self.keys.paginatedItems(), "api_key"))));
        };

        self.markAllForDeletion = function() {
            self.markedForDeletion(_.uniq(_.map(self.keys.allItems, "api_key")));
        };

        self.markAllByUserForDeletion = function(user) {
            self.markAllByFilterForDeletion(function(e) { return (e.user_id === user); });
        };

        self.markAllByAppForDeletion = function(app) {
            self.markAllByFilterForDeletion(function(e) { return (e.app_id.toLowerCase() === app); })
        };

        self.markAllByFilterForDeletion = function(filter) {
            self.markedForDeletion(_.uniq(self.markedForDeletion().concat(_.map(_.filter(self.keys.allItems, filter), "api_key"))));
        };

        self.clearMarked = function() {
            self.markedForDeletion.removeAll();
        };

        self._bulkRevoke = function(keys) {
            var title, message, handler;

            title = gettext("Revoking application keys");
            message = _.sprintf(gettext("Revoking %(count)d application keys..."), {count: keys.length});
            handler = function(key) {
                return OctoPrint.plugins.appkeys.revokeKey(key)
                    .done(function() {
                        deferred.notify(_.sprintf(gettext("Revoked %(key)s..."), {key: key}), true);
                    })
                    .fail(function(jqXHR) {
                        var short = _.sprintf(gettext("Revocation of %(key)s failed, continuing..."), {key: key});
                        var long = _.sprintf(gettext("Deletion of %(key)s failed: %(error)s"), {key: key, error: jqXHR.responseText});
                        deferred.notify(short, long, false);
                    });
            };

            var deferred = $.Deferred();

            var promise = deferred.promise();

            var options = {
                title: title,
                message: message,
                max: keys.length,
                output: true
            };
            showProgressModal(options, promise);

            var requests = [];
            _.each(keys, function(key) {
                var request = handler(key);
                requests.push(request)
            });
            $.when.apply($, _.map(requests, wrapPromiseWithAlways))
                .done(function() {
                    deferred.resolve();
                    self.requestData();
                });

            return promise;
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        UserAppKeysViewModel,
        ["loginStateViewModel"],
        ["#usersettings_plugin_appkeys"]
    ]);

    OCTOPRINT_VIEWMODELS.push([
        AllAppKeysViewModel,
        ["loginStateViewModel"],
        ["#settings_plugin_appkeys"]
    ])
});

;

// source: plugin/backup/js/backup.js
$(function() {
    function BackupViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];

        self.backups = new ItemListHelper(
            "plugin.backup.backups",
            {
                "date": function (a, b) {
                    // sorts descending
                    if (a["date"] > b["date"]) return -1;
                    if (a["date"] < b["date"]) return 1;
                    return 0;
                }
            },
            {
            },
            "date",
            [],
            [],
            10
        );

        self.markedForBackupDeletion = ko.observableArray([]);

        self.excludeFromBackup = ko.observableArray([]);
        self.backupInProgress = ko.observable(false);
        self.restoreSupported = ko.observable(true);

        self.backupUploadButton = $("#settings-backup-upload");
        self.backupUploadData = undefined;
        self.backupUploadButton.fileupload({
            dataType: "json",
            maxNumberOfFiles: 1,
            autoUpload: false,
            headers: OctoPrint.getRequestHeaders(),
            add: function(e, data) {
                if (data.files.length === 0) {
                    // no files? ignore
                    return false;
                }

                self.backupUploadName(data.files[0].name);
                self.backupUploadData = data;
            },
            done: function(e, data) {
                self.backupUploadName(undefined);
                self.backupUploadData = undefined;
            }
        });
        self.backupUploadName = ko.observable();
        self.restoreInProgress = ko.observable(false);
        self.restoreTitle = ko.observable();
        self.restoreDialog = undefined;
        self.restoreOutput = undefined;
        self.unknownPlugins = ko.observableArray([]);

        self.loglines = ko.observableArray([]);

        self.requestData = function() {
            OctoPrint.plugins.backup.get()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            self.backups.updateItems(response.backups);
            self.unknownPlugins(response.unknown_plugins);
            self.restoreSupported(response.restore_supported);
        };

        self.createBackup = function() {
            var excluded = self.excludeFromBackup();
            OctoPrint.plugins.backup.createBackup(excluded)
                .done(function() {
                    self.excludeFromBackup([]);
                })
        };

        self.removeBackup = function(backup) {
            var perform = function() {
                OctoPrint.plugins.backup.deleteBackup(backup)
                    .done(function() {
                        self.requestData();
                    });
            };
            showConfirmationDialog(_.sprintf(gettext("You are about to delete backup file \"%(name)s\"."), {name: backup}),
                perform);
        };

        self.restoreBackup = function(backup) {
            if (!self.restoreSupported()) return;

            var perform = function() {
                self.restoreInProgress(true);
                self.loglines.removeAll();
                self.loglines.push({line: "Preparing to restore...", stream: "message"});
                self.loglines.push({line: " ", stream: "message"});
                self.restoreDialog.modal({keyboard: false, backdrop: "static", show: true});

                OctoPrint.plugins.backup.restoreBackup(backup);
            };
            showConfirmationDialog(_.sprintf(gettext("You are about to restore the backup file \"%(name)s\". This cannot be undone."), {name: backup}),
                perform);
        };

        self.performRestoreFromUpload = function() {
            if (self.backupUploadData === undefined) return;

            var perform = function() {
                self.restoreInProgress(true);
                self.loglines.removeAll();
                self.loglines.push({line: "Uploading backup, this can take a while. Please wait...", stream: "message"});
                self.loglines.push({line: " ", stream: "message"});
                self.restoreDialog.modal({keyboard: false, backdrop: "static", show: true});

                self.backupUploadData.submit();
            };
            showConfirmationDialog(_.sprintf(gettext("You are about to upload and restore the backup file \"%(name)s\". This cannot be undone."), {name: self.backupUploadName()}),
                perform);
        };

        self.deleteUnknownPluginRecord = function() {
            var perform = function() {
                OctoPrint.plugins.backup.deleteUnknownPlugins()
                    .done(function() {
                        self.requestData();
                    });
            };
            showConfirmationDialog(gettext("You are about to delete the record of plugins unknown during the last restore."),
                perform);
        };

        self.markFilesOnPage = function() {
            self.markedForBackupDeletion(_.uniq(self.markedForBackupDeletion().concat(_.map(self.backups.paginatedItems(), "name"))));
        };

        self.markAllFiles = function() {
            self.markedForBackupDeletion(_.map(self.backups.allItems, "name"));
        };

        self.clearMarkedFiles = function() {
            self.markedForBackupDeletion.removeAll();
        };

        self.removeMarkedFiles = function() {
            var perform = function() {
                self._bulkRemove(self.markedForBackupDeletion())
                    .done(function() {
                        self.markedForBackupDeletion.removeAll();
                    });
            };

            showConfirmationDialog(_.sprintf(gettext("You are about to delete %(count)d backups."), {count: self.markedForBackupDeletion().length}),
                                   perform);
        };

        self.onStartup = function() {
            self.restoreDialog = $("#settings_plugin_backup_restoredialog");
            self.restoreOutput = $("#settings_plugin_backup_restoredialog_output");
        };

        self.onSettingsShown = function() {
            self.requestData();
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin !== "backup") return;

            if (data.type === "backup_done") {
                self.requestData();
                self.backupInProgress(false);
                new PNotify({
                    title: gettext("Backup created successfully"),
                    type: "success"
                });
            } else if (data.type === "backup_started") {
                self.backupInProgress(true);
            } else if (data.type === "backup_error") {
                self.requestData();
                self.backupInProgress(false);
                new PNotify({
                    title: gettext("Creating the backup failed"),
                    text: _.sprintf(gettext("OctoPrint could not create your backup. Please consult <code>octoprint.log</code> for details. Error: %(error)s"), {error:data.error}),
                    type: "error",
                    hide: false
                });
            } else if (data.type === "restore_started") {
                self.loglines.push({line: gettext("Restoring from backup..."), stream: "message"});
                self.loglines.push({line: " ", stream: "message"});
            } else if (data.type === "restore_failed") {
                self.loglines.push({line: " ", stream: "message"});
                self.loglines.push({line: gettext("Restore failed! Check the above output and octoprint.log for reasons as to why."), stream: "error"});
                self.restoreInProgress(false);
            } else if (data.type === "restore_done") {
                self.loglines.push({line: " ", stream: "message"});
                self.loglines.push({line: gettext("Restore successful! The server will now be restarted!"), stream: "message"});
                self.restoreInProgress(false);
            } else if (data.type === "install_plugin") {
                self.loglines.push({line: " ", stream: "message"});
                self.loglines.push({
                    line: _.sprintf(gettext("Installing plugin \"%(plugin)s}\"..."), {plugin: data.plugin.name}),
                    stream: "message"
                });
            } else if (data.type === "plugin_incompatible") {
                self.loglines.push({line: " ", stream: "message"});
                self.loglines.push({
                    line: _.sprintf(gettext("Cannot install plugin \"%(plugin)s\" due to it being incompatible to this OctoPrint version and/or underlying operating system"), {plugin: data.plugin.key}),
                    stream: "stderr"
                });
            } else if (data.type === "unknown_plugins") {
                if (data.plugins.length > 0) {
                    self.loglines.push({line: " ", stream: "message"});
                    self.loglines.push({line: _.sprintf(gettext("There are %(count)d plugins you'll need to install manually since they aren't registered on the repository:"), {count: data.plugins.length}), stream: "message"});
                    _.each(data.plugins, function(plugin) {
                        self.loglines.push({line: plugin.name + ": " + plugin.url, stream: "message"});
                    });
                    self.loglines.push({line: " ", stream: "message"});
                    self.unknownPlugins(data.plugins);
                }
            } else if (data.type === "logline") {
                self.loglines.push(self._preprocessLine({line: data.line, stream: data.stream}));
                self._scrollRestoreOutputToEnd();
            }
        };

        self._scrollRestoreOutputToEnd = function() {
            self.restoreOutput.scrollTop(self.restoreOutput[0].scrollHeight - self.restoreOutput.height());
        };

        self._forcedStdoutLine = /You are using pip version .*?, however version .*? is available\.|You should consider upgrading via the '.*?' command\./;
        self._preprocessLine = function(line) {
            if (line.stream === "stderr" && line.line.match(self._forcedStdoutLine)) {
                line.stream = "stdout";
            }
            return line;
        };

        self._bulkRemove = function(files) {
            var title, message, handler;

            title = gettext("Deleting backups");
            message = _.sprintf(gettext("Deleting %(count)d backups..."), {count: files.length});
            handler = function(filename) {
                return OctoPrint.plugins.backup.deleteBackup(filename)
                    .done(function() {
                        deferred.notify(_.sprintf(gettext("Deleted %(filename)s..."), {filename: filename}), true);
                    })
                    .fail(function(jqXHR) {
                        var short = _.sprintf(gettext("Deletion of %(filename)s failed, continuing..."), {filename: filename});
                        var long = _.sprintf(gettext("Deletion of %(filename)s failed: %(error)s"), {filename: filename, error: jqXHR.responseText});
                        deferred.notify(short, long, false);
                    });
            };

            var deferred = $.Deferred();

            var promise = deferred.promise();

            var options = {
                title: title,
                message: message,
                max: files.length,
                output: true
            };
            showProgressModal(options, promise);

            var requests = [];
            _.each(files, function(filename) {
                var request = handler(filename);
                requests.push(request)
            });
            $.when.apply($, _.map(requests, wrapPromiseWithAlways))
                .done(function() {
                    deferred.resolve();
                    self.requestData();
                });

            return promise;
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: BackupViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel"],
        elements: ["#settings_plugin_backup"]
    });
});

;

// source: plugin/cura/js/cura.js
$(function() {
    function CuraViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settingsViewModel = parameters[1];
        self.slicingViewModel = parameters[2];

        self.pathBroken = ko.observable(false);
        self.pathOk = ko.observable(false);
        self.pathText = ko.observable();
        self.pathHelpVisible = ko.pureComputed(function() {
            return self.pathBroken() || self.pathOk();
        });

        self.fileName = ko.observable();

        self.placeholderName = ko.observable();
        self.placeholderDisplayName = ko.observable();
        self.placeholderDescription = ko.observable();

        self.profileName = ko.observable();
        self.profileDisplayName = ko.observable();
        self.profileDescription = ko.observable();
        self.profileAllowOverwrite = ko.observable(true);
        self.profileMakeDefault = ko.observable(false);
        self.profileFirst = ko.observable(false);

        // make sure to update form data if any of the metadata changes
        self.profileName.subscribe(function() { self.copyProfileMetadata(); });
        self.profileDisplayName.subscribe(function() {
            if (self.profileDisplayName()) {
                self.placeholderName(self._sanitize(self.profileDisplayName()).toLowerCase());
            }
            self.copyProfileMetadata();
        });
        self.profileDescription.subscribe(function() { self.copyProfileMetadata(); });
        self.profileAllowOverwrite.subscribe(function() { self.copyProfileMetadata(); });
        self.profileMakeDefault.subscribe(function() { self.copyProfileMetadata(); });

        self.unconfiguredCuraEngine = ko.observable();
        self.unconfiguredSlicingProfile = ko.observable();

        self.uploadDialog = $("#settings_plugin_cura_import");
        self.uploadElement = $("#settings-cura-import");
        self.uploadData = ko.observable(undefined);
        self.uploadBusy = ko.observable(false);

        self.uploadEnabled = ko.pureComputed(function() {
            return self.fieldsEnabled();
        });
        self.fieldsEnabled = ko.pureComputed(function() {
            return self.uploadData() && !self.uploadBusy()
                && (self.profileName() || self.placeholderName())
                && (self.profileDisplayName() || self.placeholderDisplayName())
                && (self.profileDescription() || self.placeholderDescription());
        });

        self.profiles = new ItemListHelper(
            "plugin_cura_profiles",
            {
                "id": function(a, b) {
                    if (a["key"].toLocaleLowerCase() < b["key"].toLocaleLowerCase()) return -1;
                    if (a["key"].toLocaleLowerCase() > b["key"].toLocaleLowerCase()) return 1;
                    return 0;
                },
                "name": function(a, b) {
                    // sorts ascending
                    var aName = a.name();
                    if (aName === undefined) {
                        aName = "";
                    }
                    var bName = b.name();
                    if (bName === undefined) {
                        bName = "";
                    }

                    if (aName.toLocaleLowerCase() < bName.toLocaleLowerCase()) return -1;
                    if (aName.toLocaleLowerCase() > bName.toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {},
            "id",
            [],
            [],
            5
        );

        self._sanitize = function(name) {
            return name.replace(/[^a-zA-Z0-9\-_\.\(\) ]/g, "").replace(/ /g, "_");
        };

        self.performUpload = function() {
            if (self.uploadData()) {
                self.uploadData().submit();
            }
        };

        self.copyProfileMetadata = function(form) {
            form = form || (self.uploadData() ? self.uploadData().formData : {});

            if (self.profileName() !== undefined) {
                form["name"] = self.profileName();
            } else if (self.placeholderName() !== undefined) {
                form["name"] = self.placeholderName();
            }

            if (self.profileDisplayName() !== undefined) {
                form["displayName"] = self.profileDisplayName();
            } else if (self.placeholderDisplayName() !== undefined) {
                form["displayName"] = self.placeholderDisplayName();
            }

            if (self.profileDescription() !== undefined) {
                form["description"] = self.profileDescription();
            } else if (self.placeholderDescription() !== undefined) {
                form["description"] = self.placeholderDescription();
            }

            if (self.profileMakeDefault()) {
                form["default"] = true;
            }

            return form;
        };

        self.clearUpload = function() {
            self.uploadData(undefined);
            self.fileName(undefined);
            self.placeholderName(undefined);
            self.placeholderDisplayName(undefined);
            self.placeholderDescription(undefined);
            self.profileName(undefined);
            self.profileDisplayName(undefined);
            self.profileDescription(undefined);
            self.profileAllowOverwrite(true);

            var firstProfile = self.profiles.items().length === 0;
            self.profileMakeDefault(firstProfile);
            self.profileFirst(firstProfile);
        };

        self.uploadElement.fileupload({
            dataType: "json",
            maxNumberOfFiles: 1,
            autoUpload: false,
            headers: OctoPrint.getRequestHeaders(),
            add: function(e, data) {
                if (data.files.length == 0) {
                    // no files? ignore
                    return false;
                }
                if (self.uploadData()) {
                    // data already defined? ignore (should never happen)
                    return false;
                }

                self.fileName(data.files[0].name);

                var name = self.fileName().substr(0, self.fileName().lastIndexOf("."));
                self.placeholderName(self._sanitize(name).toLowerCase());
                self.placeholderDisplayName(name);
                self.placeholderDescription("Imported from " + self.fileName() + " on " + formatDate(new Date().getTime() / 1000));

                var form = {
                    allowOverwrite: self.profileAllowOverwrite()
                };
                data.formData = self.copyProfileMetadata(form);

                self.uploadData(data);
            },
            submit: function(e, data) {
                self.copyProfileMetadata();
                self.uploadBusy(true);
            },
            done: function(e, data) {
                self.uploadBusy(false);
                self.clearUpload();

                self.uploadDialog.modal("hide");
                self.requestData();
                self.slicingViewModel.requestData();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                self.uploadBusy(false);
                new PNotify({
                    title: gettext("Profile import failed"),
                    text: gettext("Could not import the provided profile, it might be invalid. Check <code>octoprint.log</code> for details"),
                    type: "error",
                    hide: false
                });
            }
        });

        self.removeProfile = function(data) {
            if (!data.resource) {
                return;
            }

            self.profiles.removeItem(function(item) {
                return (item.key == data.key);
            });

            OctoPrint.slicing.deleteProfileForSlicer("cura", data.key, {url: data.resource()})
                .done(function() {
                    self.requestData();
                    self.slicingViewModel.requestData();
                });
        };

        self.makeProfileDefault = function(data) {
            if (!data.resource) {
                return;
            }

            _.each(self.profiles.items(), function(item) {
                item.isdefault(false);
            });
            var item = self.profiles.getItem(function(item) {
                return item.key == data.key;
            });
            if (item !== undefined) {
                item.isdefault(true);
            }

            OctoPrint.slicing.updateProfileForSlicer("cura", data.key, {default: true}, {url: data.resource()})
                .done(function() {
                    self.requestData();
                });
        };

        self.showImportProfileDialog = function() {
            self.clearUpload();
            self.uploadDialog.modal("show");
        };

        self.testEnginePath = function() {
            OctoPrint.util.testExecutable(self.settings.plugins.cura.cura_engine())
                .done(function(response) {
                    if (!response.result) {
                        if (!response.exists) {
                            self.pathText(gettext("The path doesn't exist"));
                        } else if (!response.typeok) {
                            self.pathText(gettext("The path is not a file"));
                        } else if (!response.access) {
                            self.pathText(gettext("The path is not an executable"));
                        }
                    } else {
                        self.pathText(gettext("The path is valid"));
                    }
                    self.pathOk(response.result);
                    self.pathBroken(!response.result);
                });
        };

        self.requestData = function() {
            self.slicingViewModel.requestData();
        };

        self.fromResponse = function(data) {
            var profiles = [];
            _.each(_.keys(data), function(key) {
                profiles.push({
                    key: key,
                    name: ko.observable(data[key].displayName),
                    description: ko.observable(data[key].description),
                    isdefault: ko.observable(data[key].default),
                    resource: ko.observable(data[key].resource)
                });
            });
            self.profiles.updateItems(profiles);
        };

        self.onBeforeBinding = function () {
            self.settings = self.settingsViewModel.settings;
        };

        self.onAllBound = function() {
            self.uploadDialog.on("hidden", function(event) {
                if (event.target.id == "settings_plugin_cura_import") {
                    self.clearUpload();
                }
            });
        };

        self.onSettingsShown = function() {
            self.requestData();
        };

        self.onSettingsHidden = function() {
            self.resetPathTest();
        };

        self.onSlicingData = function(data) {
            if (data && data.hasOwnProperty("cura") && data.cura.hasOwnProperty("profiles")) {
                self.fromResponse(data.cura.profiles);
            }
        };

        self.resetPathTest = function() {
            self.pathBroken(false);
            self.pathOk(false);
            self.pathText("");
        };

        self.onWizardDetails = function(response) {
            if (!response.hasOwnProperty("cura") || !response.cura.required) return;

            if (response.cura.details.hasOwnProperty("engine")) {
                self.unconfiguredCuraEngine(!response.cura.details.engine);
            }
            if (response.cura.details.hasOwnProperty("profile")) {
                self.unconfiguredSlicingProfile(!response.cura.details.profile);
            }
        };

        self.onWizardFinish = function() {
            self.resetPathTest();
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: CuraViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel", "slicingViewModel"],
        elements: ["#settings_plugin_cura", "#wizard_plugin_cura"]
    });
});

;

// source: plugin/forcelogin/js/viewmodel.js
/*
 * View model that takes care to redirect to / on logout in the regular
 * OctoPrint web application.
 */

$(function() {
    function ForceLoginViewModel(parameters) {
        var self = this;

        self.onUserLoggedOut = function() {
            location.reload();
        }
    }

    // view model class, parameters for constructor, container to bind to
    ADDITIONAL_VIEWMODELS.push([ForceLoginViewModel, [], []]);
});

;

// source: plugin/logging/js/logging.js
$(function() {
    function LoggingViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.availableLoggers = ko.observableArray();
        self.availableLoggersName = ko.observable();
        self.availableLoggersLevel = ko.observable();
        self.configuredLoggers = ko.observableArray();
        self.configuredLoggersChanged = false;

        self.availableLoggersSorted = ko.computed(function() {
            return _.sortBy(self.availableLoggers());
        });

        self.configuredLoggersSorted = ko.computed(function() {
            return _.sortBy(self.configuredLoggers(), function (o) {
                o.level();
                return o.component;
            });
        });

        // initialize list helper
        self.listHelper = new ItemListHelper(
            "logFiles",
            {
                "name": function(a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase()) return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase()) return 1;
                    return 0;
                },
                "modification": function(a, b) {
                    // sorts descending
                    if (a["date"] > b["date"]) return -1;
                    if (a["date"] < b["date"]) return 1;
                    return 0;
                },
                "size": function(a, b) {
                    // sorts descending
                    if (a["size"] > b["size"]) return -1;
                    if (a["size"] < b["size"]) return 1;
                    return 0;
                }
            },
            {
            },
            "name",
            [],
            [],
            CONFIG_LOGFILESPERPAGE
        );

        self.requestData = function() {
            OctoPrint.plugins.logging.get()
                .done(self.fromResponse);
        };

        self.fromResponse = function(response) {
            self.fromLogsResponse(response.logs);
            self.fromSetupResponse(response.setup);
        };

        self.fromLogsResponse = function(response) {
            if (!response) return;

            var files = response.files;
            if (files === undefined)
                return;

            self.listHelper.updateItems(files);
        };

        self.fromSetupResponse = function(response) {
            if (!response) return;

            // levels
            var levels = [];
            var configuredLoggers = [];
            _.each(response.levels, function(level, logger) {
                var item = {component: logger, level: ko.observable(level)};
                item.level.subscribe(function() {
                    self.configuredLoggersHasChanged();
                });
                levels.push(item);
                configuredLoggers.push(logger);
            });
            self.configuredLoggers(levels);

            // loggers
            var availableLoggers = _.without(response.loggers, configuredLoggers);
            self.availableLoggers(availableLoggers);
        };

        self.configuredLoggersHasChanged = function () {
            self.configuredLoggersChanged = true;
        };

        self.addLogger = function() {
            var component = self.availableLoggersName();
            var level = self.availableLoggersLevel();

            self.configuredLoggers.push({component: component, level: ko.observable(level)});
            self.availableLoggers.remove(component);

            self.configuredLoggersHasChanged();
        };

        self.removeLogger = function(logger) {
            self.configuredLoggers.remove(logger);
            self.availableLoggers.push(logger.component);

            self.configuredLoggersHasChanged();
        };

        self.removeFile = function(filename) {
            OctoPrint.plugins.logging.deleteLog(filename)
                .done(self.requestData);
        };

        self.onSettingsShown = function() {
            self.requestData();
        };

        self.onSettingsBeforeSave = function () {
            if ( self.configuredLoggersChanged ) {
                console.log("ConfiguredLoggers has changed. Saving!");
                var levels = {};
                _.each(self.configuredLoggers(), function(data) {
                    levels[data.component] = data.level();
                });
                OctoPrint.plugins.logging.updateLevels(levels);
            } else {
                console.log("ConfiguredLoggers has not changed. Not saving.");
            }
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: LoggingViewModel,
        additionalNames: ["logsViewModel"],
        dependencies: ["loginStateViewModel"],
        elements: ["#settings_plugin_logging"]
    });
});

;

// source: plugin/octopi_support/js/octopi_support.js
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["OctoPrintClient"], factory);
    } else {
        factory(global.OctoPrintClient);
    }
})(this, function(OctoPrintClient) {
    var OctoPrintOctoPiSupportClient = function(base) {
        this.base = base;
    };

    OctoPrintOctoPiSupportClient.prototype.get = function(opts) {
        return this.base.get(this.base.getSimpleApiUrl("octopi_support"));
    };

    OctoPrintClient.registerPluginComponent("octopi_support", OctoPrintOctoPiSupportClient);
    return OctoPrintOctoPiSupportClient;
});

$(function() {

    function OctoPiSupportViewModel(parameters) {
        var self = this;

        self.requestData = function() {
            OctoPrint.plugins.octopi_support.get()
                .done(function(response) {
                    $("#octopi_support_footer").remove();
                    if (!response.version) return;

                    var octoPrintVersion = $(".footer span.version");
                    var octoPiVersion = $("<span id='octopi_support_footer'> " + gettext("running on") + " " + gettext("OctoPi")
                        + " <span class='octopi_version'>" + response.version + "</span></span>")
                    $(octoPiVersion).insertAfter(octoPrintVersion);
                })
        };

        self.onStartup = function() {
            self.requestData();
        };

        self.onServerReconnect = function() {
            self.requestData();
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: OctoPiSupportViewModel
    });
});

;

// source: plugin/pi_support/js/pi_support.js
$(function() {

    function PiSupportViewModel(parameters) {
        var self = this;

        self.model = ko.observable();

        self.currentUndervoltage = ko.observable(false);
        self.currentOverheat = ko.observable(false);
        self.pastUndervoltage = ko.observable(false);
        self.pastOverheat = ko.observable(false);
        self.currentIssue = ko.observable(false);
        self.pastIssue = ko.observable(false);

        self.requestData = function() {
            OctoPrint.plugins.pi_support.get()
                .done(function(response) {
                    // Raspberry Pi model
                    self.model(response.model);

                    // Throttle state
                    self.fromThrottleState(response.throttle_state);

                    // OctoPi version
                    $("#octopi_support_footer").remove();
                    if (!response.octopi_version) return;

                    var octoPrintVersion = $(".footer span.version");
                    var octoPiVersion = $("<span id='octopi_support_footer'> " + gettext("running on") + " " + gettext("OctoPi")
                        + " <span class='octopi_version'>" + response.octopi_version + "</span></span>");
                    $(octoPiVersion).insertAfter(octoPrintVersion);
                })
        };

        self.fromThrottleState = function(state) {
            self.currentUndervoltage(state.current_undervoltage);
            self.pastUndervoltage(state.past_undervoltage);
            self.currentOverheat(state.current_overheat);
            self.pastOverheat(state.past_overheat);
            self.currentIssue(state.current_issue);
            self.pastIssue(state.past_issue);
        };

        self.popoverContent = ko.pureComputed(function() {
            var undervoltageParagraphClasses = "muted";
            var undervoltageSymbolClasses = "";

            var overheatParagraphClasses = "muted";
            var overheatSymbolClasses = "";

            if (self.currentUndervoltage()) {
                undervoltageSymbolClasses = "text-error pi_support_state_pulsate";
                undervoltageParagraphClasses = "";
            } else if (self.pastUndervoltage()) {
                undervoltageSymbolClasses = "text-error";
                undervoltageParagraphClasses = "";
            }

            if (self.currentOverheat()) {
                overheatSymbolClasses = "text-error pi_support_state_pulsate";
                overheatParagraphClasses = "";
            } else if (self.pastOverheat()) {
                overheatSymbolClasses = "text-error";
                overheatParagraphClasses = "";
            }

            return "<p class='" + undervoltageParagraphClasses + "'><strong class='" + undervoltageSymbolClasses + "'><i class=\"fa fa-bolt\"></i><i class=\"fa fa-exclamation\"></i></strong></strong> - " + gettext("Undervoltage. Make sure your power supply and cabling are providing enough power to the Pi.") + "</p>"
                + "<p class='" + overheatParagraphClasses + "'><strong class='" + overheatSymbolClasses + "'><i class=\"fa fa-thermometer-full\"></i><i class=\"fa fa-exclamation\"></i></strong> - " + gettext("Frequency capping due to overheating. Improve cooling of the CPU and GPU.") + "</p>"
                + "<p>" + gettext("A blinking symbol indicates a current issue, a non blinking symbol one that was observed some time since the Pi booted up.") + "</p>"
                + "<p><small>" + gettext("Click the symbol in the navbar for more information.") + "</small></p>";
        });

        self.onStartup = function() {
            self.requestData();
        };

        self.onServerReconnect = function() {
            self.requestData();
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin !== "pi_support") return;
            if (!data.hasOwnProperty("state") || !data.hasOwnProperty("type")) return;
            if (data.type !== "throttle_state") return;

            self.fromThrottleState(data.state);
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: PiSupportViewModel,
        elements: ["#navbar_plugin_pi_support"]
    });
});

;

// source: plugin/pluginmanager/js/pluginmanager.js
$(function() {
    function PluginManagerViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settingsViewModel = parameters[1];
        self.printerState = parameters[2];
        self.systemViewModel = parameters[3];

        self.config_repositoryUrl = ko.observable();
        self.config_repositoryTtl = ko.observable();
        self.config_noticesUrl = ko.observable();
        self.config_noticesTtl = ko.observable();
        self.config_pipAdditionalArgs = ko.observable();
        self.config_pipForceUser = ko.observable();

        self.configurationDialog = $("#settings_plugin_pluginmanager_configurationdialog");

        self.plugins = new ItemListHelper(
            "plugin.pluginmanager.installedplugins",
            {
                "name": function (a, b) {
                    // sorts ascending
                    if (a["name"].toLocaleLowerCase() < b["name"].toLocaleLowerCase()) return -1;
                    if (a["name"].toLocaleLowerCase() > b["name"].toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {
            },
            "name",
            [],
            [],
            5
        );

        self.repositoryplugins = new ItemListHelper(
            "plugin.pluginmanager.repositoryplugins",
            {
                "title": function (a, b) {
                    // sorts ascending
                    if (a["title"].toLocaleLowerCase() < b["title"].toLocaleLowerCase()) return -1;
                    if (a["title"].toLocaleLowerCase() > b["title"].toLocaleLowerCase()) return 1;
                    return 0;
                },
                "published": function (a, b) {
                    // sorts descending
                    if (a["published"].toLocaleLowerCase() > b["published"].toLocaleLowerCase()) return -1;
                    if (a["published"].toLocaleLowerCase() < b["published"].toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {
                "filter_installed": function(plugin) {
                    return !self.installed(plugin);
                },
                "filter_incompatible": function(plugin) {
                    return plugin.is_compatible.octoprint && plugin.is_compatible.os;
                }
            },
            "title",
            ["filter_installed", "filter_incompatible"],
            [],
            0
        );

        self.uploadElement = $("#settings_plugin_pluginmanager_repositorydialog_upload");
        self.uploadButton = $("#settings_plugin_pluginmanager_repositorydialog_upload_start");

        self.repositoryAvailable = ko.observable(false);

        self.repositorySearchQuery = ko.observable();
        self.repositorySearchQuery.subscribe(function() {
            self.performRepositorySearch();
        });

        self.installUrl = ko.observable();
        self.uploadFilename = ko.observable();

        self.loglines = ko.observableArray([]);
        self.installedPlugins = ko.observableArray([]);

        self.followDependencyLinks = ko.observable(false);

        self.pipAvailable = ko.observable(false);
        self.pipVersion = ko.observable();
        self.pipInstallDir = ko.observable();
        self.pipUseUser = ko.observable();
        self.pipVirtualEnv = ko.observable();
        self.pipAdditionalArgs = ko.observable();
        self.pipPython = ko.observable();

        self.safeMode = ko.observable();
        self.online = ko.observable();

        self.pipUseUserString = ko.pureComputed(function() {
            return self.pipUseUser() ? "yes" : "no";
        });
        self.pipVirtualEnvString = ko.pureComputed(function() {
            return self.pipVirtualEnv() ? "yes" : "no";
        });

        self.working = ko.observable(false);
        self.workingTitle = ko.observable();
        self.workingDialog = undefined;
        self.workingOutput = undefined;

        self.restartCommandSpec = undefined;
        self.systemViewModel.systemActions.subscribe(function() {
            var lastResponse = self.systemViewModel.lastCommandResponse;
            if (!lastResponse || !lastResponse.core) {
                self.restartCommandSpec = undefined;
                return;
            }

            var restartSpec = _.filter(lastResponse.core, function(spec) { return spec.action == "restart" });
            self.restartCommandSpec = restartSpec != undefined && restartSpec.length > 0 ? restartSpec[0] : undefined;
        });

        self.notifications = [];
        self.noticeNotifications = [];
        self.hiddenNoticeNotifications = {};
        self.noticeCount = ko.observable(0);

        self.notification = undefined;
        self.logContents = {
            steps: [],
            action: {
                reload: false,
                refresh: false,
                reconnect: false
            }
        };

        self.noticeCountText = ko.pureComputed(function() {
            var count = self.noticeCount();
            if (count == 0) {
                return gettext("There are no plugin notices. Great!");
            } else if (count == 1) {
                return gettext("There is a plugin notice for one of your installed plugins.");
            } else {
                return _.sprintf(gettext("There are %(count)d plugin notices for one or more of your installed plugins."), {count: count});
            }
        });

        self.enableManagement = ko.pureComputed(function() {
            return !self.printerState.isPrinting();
        });

        self.enableToggle = function(data) {
            var command = self._getToggleCommand(data);
            var not_safemode_victim = !data.safe_mode_victim;
            var not_blacklisted = !data.blacklisted;
            return self.enableManagement() && (command == "disable" || (not_safemode_victim && not_blacklisted)) && data.key != 'pluginmanager';
        };

        self.enableUninstall = function(data) {
            return self.enableManagement()
                && (data.origin != "entry_point" || self.pipAvailable())
                && data.managable
                && !data.bundled
                && data.key != 'pluginmanager'
                && !data.pending_uninstall;
        };

        self.enableRepoInstall = function(data) {
            return self.enableManagement() && self.pipAvailable() && !self.safeMode() && self.online() && self.isCompatible(data);
        };

        self.invalidUrl = ko.pureComputed(function() {
            // supported pip install URL schemes, according to https://pip.pypa.io/en/stable/reference/pip_install/
            var allowedUrlSchemes = ["http", "https",
                                     "git", "git+http", "git+https", "git+ssh", "git+git",
                                     "hg+http", "hg+https", "hg+static-http", "hg+ssh",
                                     "svn", "svn+svn", "svn+http", "svn+https", "svn+ssh",
                                     "bzr+http", "bzr+https", "bzr+ssh", "bzr+sftp", "brz+ftp", "bzr+lp"];

            var url = self.installUrl();
            var lowerUrl = url !== undefined ? url.toLocaleLowerCase() : undefined;

            var lowerUrlStartsWithScheme = function(scheme) {
                return _.startsWith(lowerUrl, scheme + "://");
            };

            return url !== undefined && url.trim() !== ""
                && !(_.any(allowedUrlSchemes, lowerUrlStartsWithScheme));
        });

        self.enableUrlInstall = ko.pureComputed(function() {
            var url = self.installUrl();
            return self.enableManagement()
                && self.pipAvailable()
                && !self.safeMode()
                && self.online()
                && url !== undefined
                && url.trim() !== ""
                && !self.invalidUrl();
        });

        self.invalidArchive = ko.pureComputed(function() {
            var allowedArchiveExtensions = [".zip", ".tar.gz", ".tgz", ".tar"];

            var name = self.uploadFilename();
            var lowerName = name !== undefined ? name.toLocaleLowerCase() : undefined;

            var lowerNameHasExtension = function(extension) {
                return _.endsWith(lowerName, extension);
            };

            return name !== undefined
                && !(_.any(allowedArchiveExtensions, lowerNameHasExtension));
        });

        self.enableArchiveInstall = ko.pureComputed(function() {
            var name = self.uploadFilename();
            return self.enableManagement()
                && self.pipAvailable()
                && !self.safeMode()
                && name !== undefined
                && name.trim() !== ""
                && !self.invalidArchive();
        });

        self.uploadElement.fileupload({
            dataType: "json",
            maxNumberOfFiles: 1,
            autoUpload: false,
            add: function(e, data) {
                if (data.files.length == 0) {
                    return false;
                }

                self.uploadFilename(data.files[0].name);

                self.uploadButton.unbind("click");
                self.uploadButton.bind("click", function() {
                    self._markWorking(gettext("Installing plugin..."), gettext("Installing plugin from uploaded archive..."));
                    data.formData = {
                        dependency_links: self.followDependencyLinks()
                    };
                    data.submit();
                    return false;
                });
            },
            done: function(e, data) {
                var response = data.result;
                if (response.result) {
                    self._markDone();
                } else {
                    self._markDone(response.reason);
                }

                self.uploadButton.unbind("click");
                self.uploadFilename(undefined);
            },
            fail: function(e, data) {
                new PNotify({
                    title: gettext("Something went wrong"),
                    text: gettext("Please consult octoprint.log for details"),
                    type: "error",
                    hide: false
                });
                self._markDone("Could not install plugin, unknown error.");
                self.uploadButton.unbind("click");
                self.uploadFilename(undefined);
            }
        });

        self.performRepositorySearch = function() {
            var query = self.repositorySearchQuery();
            if (query !== undefined && query.trim() != "") {
                query = query.toLocaleLowerCase();
                self.repositoryplugins.changeSearchFunction(function(entry) {
                    return entry && (entry["title"].toLocaleLowerCase().indexOf(query) > -1 || entry["description"].toLocaleLowerCase().indexOf(query) > -1);
                });
            } else {
                self.repositoryplugins.resetSearch();
            }
            return false;
        };

        self.fromResponse = function(data, options) {
            self._fromPluginsResponse(data.plugins, options);
            self._fromRepositoryResponse(data.repository, options);
            self._fromPipResponse(data.pip, options);

            self.safeMode(data.safe_mode || false);
            self.online(data.online !== undefined ? data.online : true);
        };

        self._fromPluginsResponse = function(data, options) {
            var evalNotices = options.eval_notices || false;
            var ignoreNoticeHidden = options.ignore_notice_hidden || false;
            var ignoreNoticeIgnored = options.ignore_notice_ignored || false;

            if (evalNotices) self._removeAllNoticeNotifications();

            var installedPlugins = [];
            var noticeCount = 0;
            _.each(data, function(plugin) {
                installedPlugins.push(plugin.key);

                if (evalNotices && plugin.notifications && plugin.notifications.length) {
                    _.each(plugin.notifications, function(notification) {
                        noticeCount++;
                        if (!ignoreNoticeIgnored && self._isNoticeNotificationIgnored(plugin.key, notification.date)) return;
                        if (!ignoreNoticeHidden && self._isNoticeNotificationHidden(plugin.key, notification.date)) return;
                        self._showPluginNotification(plugin, notification);
                    });
                }
            });
            if (evalNotices) self.noticeCount(noticeCount);
            self.installedPlugins(installedPlugins);
            self.plugins.updateItems(data);
        };

        self._fromRepositoryResponse = function(data) {
            self.repositoryAvailable(data.available);
            if (data.available) {
                self.repositoryplugins.updateItems(data.plugins);
            } else {
                self.repositoryplugins.updateItems([]);
            }
        };

        self._fromPipResponse = function(data) {
            self.pipAvailable(data.available);
            if (data.available) {
                self.pipVersion(data.version);
                self.pipInstallDir(data.install_dir);
                self.pipUseUser(data.use_user);
                self.pipVirtualEnv(data.virtual_env);
                self.pipAdditionalArgs(data.additional_args);
                self.pipPython(data.python);
            } else {
                self.pipVersion(undefined);
                self.pipInstallDir(undefined);
                self.pipUseUser(undefined);
                self.pipVirtualEnv(undefined);
                self.pipAdditionalArgs(undefined);
            }
        };

        self.requestData = function(options) {
            if (!self.loginState.isAdmin()) {
                return;
            }

            if (!_.isPlainObject(options)) {
                options = {
                    refresh_repo: options,
                    refresh_notices: false,
                    eval_notices: false
                };

            }

            options.refresh_repo = options.refresh_repo || false;
            options.refresh_notices = options.refresh_notices || false;
            options.eval_notices = options.eval_notices || false;

            OctoPrint.plugins.pluginmanager.get({repo: options.refresh_repo, notices: options.refresh_notices})
                .done(function(data) {
                    self.fromResponse(data, options);
                });
        };

        self.togglePlugin = function(data) {
            if (!self.loginState.isAdmin()) {
                return;
            }

            if (!self.enableManagement()) {
                return;
            }

            if (data.key == "pluginmanager") return;

            var onSuccess = function() {
                    self.requestData();
                },
                onError = function() {
                    new PNotify({
                        title: gettext("Something went wrong"),
                        text: gettext("Please consult octoprint.log for details"),
                        type: "error",
                        hide: false
                    })
                };

            if (self._getToggleCommand(data) == "enable") {
                if (data.safe_mode_victim) return;
                OctoPrint.plugins.pluginmanager.enable(data.key)
                    .done(onSuccess)
                    .fail(onError);
            } else {
                var perform = function() {
                    OctoPrint.plugins.pluginmanager.disable(data.key)
                        .done(onSuccess)
                        .fail(onError);
                };

                if (data.disabling_discouraged) {
                    var message = _.sprintf(gettext("You are about to disable \"%(name)s\"."), {name: data.name})
                        + "</p><p>" + data.disabling_discouraged;
                    showConfirmationDialog({
                        title: gettext("This is not recommended"),
                        message: message,
                        question: gettext("Do you still want to disable it?"),
                        cancel: gettext("Keep enabled"),
                        proceed: gettext("Disable anyway"),
                        onproceed: perform
                    })
                } else {
                    perform();
                }
            }
        };

        self.showRepository = function() {
            self.repositoryDialog.modal("show");
        };

        self.pluginDetails = function(data) {
            window.open(data.page);
        };

        self.installFromRepository = function(data) {
            if (!self.loginState.isAdmin()) {
                return;
            }

            if (!self.enableManagement()) {
                return;
            }

            self.installPlugin(data.archive, data.title, (self.installed(data) ? data.id : undefined), data.follow_dependency_links || self.followDependencyLinks());
        };

        self.installPlugin = function(url, name, reinstall, followDependencyLinks) {
            if (!self.loginState.isAdmin()) {
                return;
            }

            if (!self.enableManagement()) {
                return;
            }

            if (url === undefined) {
                url = self.installUrl();
            }
            if (!url) return;

            if (followDependencyLinks === undefined) {
                followDependencyLinks = self.followDependencyLinks();
            }

            var workTitle, workText;
            if (!reinstall) {
                workTitle = gettext("Installing plugin...");
                if (name) {
                    workText = _.sprintf(gettext("Installing plugin \"%(name)s\" from %(url)s..."), {url: url, name: name});
                } else {
                    workText = _.sprintf(gettext("Installing plugin from %(url)s..."), {url: url});
                }
            } else {
                workTitle = gettext("Reinstalling plugin...");
                workText = _.sprintf(gettext("Reinstalling plugin \"%(name)s\" from %(url)s..."), {url: url, name: name});
            }
            self._markWorking(workTitle, workText);

            var onSuccess = function(response) {
                    if (response.result) {
                        self._markDone();
                    } else {
                        self._markDone(response.reason)
                    }
                    self.requestData();
                    self.installUrl("");
                },
                onError = function() {
                    self._markDone("Could not install plugin, unknown error, please consult octoprint.log for details");
                    new PNotify({
                        title: gettext("Something went wrong"),
                        text: gettext("Please consult octoprint.log for details"),
                        type: "error",
                        hide: false
                    });
                };

            if (reinstall) {
                OctoPrint.plugins.pluginmanager.reinstall(reinstall, url, followDependencyLinks)
                    .done(onSuccess)
                    .fail(onError);
            } else {
                OctoPrint.plugins.pluginmanager.install(url, followDependencyLinks)
                    .done(onSuccess)
                    .fail(onError);
            }
        };

        self.uninstallPlugin = function(data) {
            if (!self.loginState.isAdmin()) {
                return;
            }

            if (!self.enableUninstall(data)) {
                return;
            }

            if (data.bundled) return;
            if (data.key == "pluginmanager") return;

            self._markWorking(gettext("Uninstalling plugin..."), _.sprintf(gettext("Uninstalling plugin \"%(name)s\""), {name: data.name}));

            OctoPrint.plugins.pluginmanager.uninstall(data.key)
                .done(function() {
                    self.requestData();
                })
                .fail(function() {
                    new PNotify({
                        title: gettext("Something went wrong"),
                        text: gettext("Please consult octoprint.log for details"),
                        type: "error",
                        hide: false
                    });
                })
                .always(function() {
                    self._markDone();
                });
        };

        self.refreshRepository = function() {
            if (!self.loginState.isAdmin()) {
                return;
            }
            self.requestData({refresh_repo: true});
        };

        self.refreshNotices = function() {
            if (!self.loginState.isAdmin()) {
                return;
            }

            self.requestData({refresh_notices: true, eval_notices: true, ignore_notice_hidden: true, ignore_notice_ignored: true});
        };

        self.reshowNotices = function() {
            if (!self.loginState.isAdmin()) {
                return;
            }

            self.requestData({eval_notices: true, ignore_notice_hidden: true, ignore_notice_ignored: true});
        };

        self.showPluginSettings = function() {
            self._copyConfig();
            self.configurationDialog.modal();
        };

        self.savePluginSettings = function() {
            var repository = self.config_repositoryUrl();
            if (repository != undefined && repository.trim() == "") {
                repository = null;
            }

            var repositoryTtl;
            try {
                repositoryTtl = parseInt(self.config_repositoryTtl());
            } catch (ex) {
                repositoryTtl = null;
            }

            var notices = self.config_noticesUrl();
            if (notices != undefined && notices.trim() == "") {
                notices = null;
            }

            var noticesTtl;
            try {
                noticesTtl = parseInt(self.config_noticesTtl());
            } catch (ex) {
                noticesTtl = null;
            }

            var pipArgs = self.config_pipAdditionalArgs();
            if (pipArgs != undefined && pipArgs.trim() == "") {
                pipArgs = null;
            }

            var data = {
                plugins: {
                    pluginmanager: {
                        repository: repository,
                        repository_ttl: repositoryTtl,
                        notices: notices,
                        notices_ttl: noticesTtl,
                        pip_args: pipArgs,
                        pip_force_user: self.config_pipForceUser()
                    }
                }
            };
            self.settingsViewModel.saveData(data, function() {
                self.configurationDialog.modal("hide");
                self._copyConfig();
                self.requestData({refresh_repo: true, refresh_notices: true, eval_notices: true});
            });
        };

        self._copyConfig = function() {
            self.config_repositoryUrl(self.settingsViewModel.settings.plugins.pluginmanager.repository());
            self.config_repositoryTtl(self.settingsViewModel.settings.plugins.pluginmanager.repository_ttl());
            self.config_noticesUrl(self.settingsViewModel.settings.plugins.pluginmanager.notices());
            self.config_noticesTtl(self.settingsViewModel.settings.plugins.pluginmanager.notices_ttl());
            self.config_pipAdditionalArgs(self.settingsViewModel.settings.plugins.pluginmanager.pip_args());
            self.config_pipForceUser(self.settingsViewModel.settings.plugins.pluginmanager.pip_force_user());
        };

        self.installed = function(data) {
            return _.includes(self.installedPlugins(), data.id);
        };

        self.isCompatible = function(data) {
            return data.is_compatible.octoprint && data.is_compatible.os;
        };

        self.installButtonText = function(data) {
            return self.isCompatible(data) ? (self.installed(data) ? gettext("Reinstall") : gettext("Install")) : (data.disabled ? gettext("Disabled") : gettext("Incompatible"));
        };

        self._displayPluginManagementNotification = function(response, action, plugin) {
            self.logContents.action.restart = self.logContents.action.restart || response.needs_restart;
            self.logContents.action.refresh = self.logContents.action.refresh || response.needs_refresh;
            self.logContents.action_reconnect = self.logContents.action.reconnect || response.needs_reconnect;
            self.logContents.steps.push({action: action, plugin: plugin, result: response.result});

            var title = gettext("Plugin management log");
            var text = "<p><ul>";

            var steps = self.logContents.steps;
            if (steps.length > 5) {
                var count = steps.length - 5;
                var line;
                if (count > 1) {
                    line = gettext("%(count)d earlier actions...");
                } else {
                    line = gettext("%(count)d earlier action");
                }
                text += "<li><em>" + _.sprintf(line, {count: count}) + "</em></li>";
                steps = steps.slice(steps.length - 5);
            }

            _.each(steps, function(step) {
                var line = undefined;

                switch (step.action) {
                    case "install": {
                        line = gettext("Install <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "uninstall": {
                        line = gettext("Uninstall <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "enable": {
                        line = gettext("Enable <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    case "disable": {
                        line = gettext("Disable <em>%(plugin)s</em>: %(result)s");
                        break;
                    }
                    default: {
                        return;
                    }
                }

                text += "<li>"
                    + _.sprintf(line, {plugin: step.plugin, result: step.result ? "<i class=\"fa fa-check\"></i>" : "<i class=\"fa fa-remove\"></i>"})
                    + "</li>";
            });
            text += "</ul></p>";

            var confirm = undefined;
            var type = "success";
            if (self.logContents.action.restart) {
                text += "<p>" + gettext("A restart is needed for the changes to take effect.") + "</p>";
                type = "warning";

                if (self.restartCommandSpec) {
                    var restartClicked = false;
                    confirm = {
                        confirm: true,
                        buttons: [{
                            text: gettext("Restart now"),
                            click: function (notice) {
                                if (restartClicked) return;
                                restartClicked = true;
                                showConfirmationDialog({
                                    message: gettext("<strong>This will restart your OctoPrint server.</strong></p><p>This action may disrupt any ongoing print jobs (depending on your printer's controller and general setup that might also apply to prints run directly from your printer's internal storage)."),
                                    onproceed: function() {
                                        OctoPrint.system.executeCommand("core", "restart")
                                            .done(function() {
                                                notice.remove();
                                                new PNotify({
                                                    title: gettext("Restart in progress"),
                                                    text: gettext("The server is now being restarted in the background")
                                                })
                                            })
                                            .fail(function() {
                                                new PNotify({
                                                    title: gettext("Something went wrong"),
                                                    text: gettext("Trying to restart the server produced an error, please check octoprint.log for details. You'll have to restart manually.")
                                                })
                                            });
                                    },
                                    onclose: function() {
                                        restartClicked = false;
                                    }
                                });
                            }
                        }]
                    }
                }
            } else if (self.logContents.action.refresh) {
                text += "<p>" + gettext("A refresh is needed for the changes to take effect.") + "</p>";
                type = "warning";

                var refreshClicked = false;
                confirm = {
                    confirm: true,
                    buttons: [{
                        text: gettext("Reload now"),
                        click: function () {
                            if (refreshClicked) return;
                            refreshClicked = true;
                            location.reload(true);
                        }
                    }]
                }
            } else if (self.logContents.action_reconnect) {
                text += "<p>" + gettext("A reconnect to the printer is needed for the changes to take effect.") + "</p>";
                type = "warning";
            }

            var options = {
                title: title,
                text: text,
                type: type
            };

            if (self.logNotification !== undefined) {
                self.logNotification.remove();
            }

            if (confirm !== undefined) {
                options.confirm = confirm;
                options.hide = false;
                self.logNotification = PNotify.singleButtonNotify(options);
            } else {
                self.logNotification = new PNotify(options);
            }
        };

        self._markWorking = function(title, line) {
            self.working(true);
            self.workingTitle(title);

            self.loglines.removeAll();
            self.loglines.push({line: line, stream: "message"});
            self._scrollWorkingOutputToEnd();

            self.workingDialog.modal({keyboard: false, backdrop: "static", show: true});
        };

        self._markDone = function(error) {
            self.working(false);
            if (error) {
                self.loglines.push({line: gettext("Error!"), stream: "error"});
                self.loglines.push({line: error, stream: "error"})
            } else {
                self.loglines.push({line: gettext("Done!"), stream: "message"});
            }
            self._scrollWorkingOutputToEnd();
        };

        self._scrollWorkingOutputToEnd = function() {
            self.workingOutput.scrollTop(self.workingOutput[0].scrollHeight - self.workingOutput.height());
        };

        self._getToggleCommand = function(data) {
            var disable = (data.enabled || (data.safe_mode_victim && !data.forced_disabled) || data.pending_enable)
                && !data.pending_disable;
            return disable ? "disable" : "enable";
        };

        self.toggleButtonCss = function(data) {
            var icon = self._getToggleCommand(data) == "enable" ? "fa fa-toggle-off" : "fa fa-toggle-on";
            var disabled = (self.enableToggle(data)) ? "" : " disabled";

            return icon + disabled;
        };

        self.toggleButtonTitle = function(data) {
            var command = self._getToggleCommand(data);
            if (command == "enable") {
                if (data.blacklisted) {
                    return gettext("Blacklisted");
                } else if (data.safe_mode_victim) {
                    return gettext("Disabled due to active safe mode");
                } else {
                    return gettext("Enable Plugin");
                }
            } else {
                return gettext("Disable Plugin");
            }
        };

        self.showPluginNotifications = function(plugin) {
            if (!plugin.notifications || plugin.notifications.length == 0) return;

            self._removeAllNoticeNotificationsForPlugin(plugin.key);
            _.each(plugin.notifications, function(notification) {
                self._showPluginNotification(plugin, notification);
            });
        };

        self.showPluginNotificationsLinkText = function(plugins) {
            if (!plugins.notifications || plugins.notifications.length == 0) return;

            var count = plugins.notifications.length;
            var importantCount = _.filter(plugins.notifications, function(notification) { return notification.important }).length;
            if (count > 1) {
                if (importantCount) {
                    return _.sprintf(gettext("There are %(count)d notices (%(important)d marked as important) available regarding this plugin - click to show!"), {count: count, important: importantCount});
                } else {
                    return _.sprintf(gettext("There are %(count)d notices available regarding this plugin - click to show!"), {count: count});
                }
            } else {
                if (importantCount) {
                    return gettext("There is an important notice available regarding this plugin - click to show!");
                } else {
                    return gettext("There is a notice available regarding this plugin - click to show!");
                }
            }
        };

        self._showPluginNotification = function(plugin, notification) {
            var name = plugin.name;
            var version = plugin.version;

            var important = notification.important;
            var link = notification.link;

            var title;
            if (important) {
                title = _.sprintf(gettext("Important notice regarding plugin \"%(name)s\""), {name: name});
            } else {
                title = _.sprintf(gettext("Notice regarding plugin \"%(name)s\""), {name: name});
            }

            var text = "";

            if (notification.versions && notification.versions.length > 0) {
                var versions = _.map(notification.versions, function(v) { return (v == version) ? "<strong>" + v + "</strong>" : v; }).join(", ");
                text += "<small>" + _.sprintf(gettext("Affected versions: %(versions)s"), {versions: versions}) + "</small>";
            } else {
                text += "<small>" + gettext("Affected versions: all") + "</small>";
            }

            text += "<p>" + notification.text + "</p>";
            if (link) {
                text += "<p><a href='" + link + "' target='_blank'>" + gettext("Read more...") + "</a></p>";
            }

            var beforeClose = function(notification) {
                if (!self.noticeNotifications[plugin.key]) return;
                self.noticeNotifications[plugin.key] = _.without(self.noticeNotifications[plugin.key], notification);
            };

            var options = {
                title: title,
                text: text,
                type: (important) ? "error" : "notice",
                before_close: beforeClose,
                hide: false,
                confirm: {
                    confirm: true,
                    buttons: [{
                        text: gettext("Later"),
                        click: function(notice) {
                            self._hideNoticeNotification(plugin.key, notification.date);
                            notice.remove();
                            notice.get().trigger("pnotify.cancel", notice);
                        }
                    }, {
                        text: gettext("Mark read"),
                        click: function(notice) {
                            self._ignoreNoticeNotification(plugin.key, notification.date);
                            notice.remove();
                            notice.get().trigger("pnotify.cancel", notice);
                        }
                    }]
                },
                buttons: {
                    sticker: false,
                    closer: false
                }
            };

            if (!self.noticeNotifications[plugin.key]) {
                self.noticeNotifications[plugin.key] = [];
            }
            self.noticeNotifications[plugin.key].push(new PNotify(options));
        };

        self._removeAllNoticeNotifications = function() {
            _.each(_.keys(self.noticeNotifications), function(key) {
                self._removeAllNoticeNotificationsForPlugin(key);
            });
        };

        self._removeAllNoticeNotificationsForPlugin = function(key) {
            if (!self.noticeNotifications[key] || !self.noticeNotifications[key].length) return;
            _.each(self.noticeNotifications[key], function(notification) {
                notification.remove();
            });
        };

        self._hideNoticeNotification = function(key, date) {
            if (!self.hiddenNoticeNotifications[key]) {
                self.hiddenNoticeNotifications[key] = [];
            }
            if (!_.contains(self.hiddenNoticeNotifications[key], date)) {
                self.hiddenNoticeNotifications[key].push(date);
            }
        };

        self._isNoticeNotificationHidden = function(key, date) {
            if (!self.hiddenNoticeNotifications[key]) return false;
            return _.any(_.map(self.hiddenNoticeNotifications[key], function(d) { return date == d; }));
        };

        var noticeLocalStorageKey = "plugin.pluginmanager.seen_notices";
        self._ignoreNoticeNotification = function(key, date) {
            if (!Modernizr.localstorage)
                return false;
            if (!self.loginState.isAdmin())
                return false;

            var currentString = localStorage[noticeLocalStorageKey];
            var current;
            if (currentString === undefined) {
                current = {};
            } else {
                current = JSON.parse(currentString);
            }
            if (!current[self.loginState.username()]) {
                current[self.loginState.username()] = {};
            }
            if (!current[self.loginState.username()][key]) {
                current[self.loginState.username()][key] = [];
            }

            if (!_.contains(current[self.loginState.username()][key], date)) {
                current[self.loginState.username()][key].push(date);
                localStorage[noticeLocalStorageKey] = JSON.stringify(current);
            }
        };

        self._isNoticeNotificationIgnored = function(key, date) {
            if (!Modernizr.localstorage)
                return false;

            if (localStorage[noticeLocalStorageKey] == undefined)
                return false;

            var knownData = JSON.parse(localStorage[noticeLocalStorageKey]);

            if (!self.loginState.isAdmin())
                return true;

            var userData = knownData[self.loginState.username()];
            if (userData === undefined)
                return false;

            return userData[key] && _.contains(userData[key], date);
        };

        self.onBeforeBinding = function() {
            self.settings = self.settingsViewModel.settings;
        };

        self.onUserLoggedIn = function(user) {
            if (user.admin) {
                self.requestData({eval_notices: true});
            } else {
                self.onUserLoggedOut();
            }
        };

        self.onUserLoggedOut = function() {
            self._resetNotifications();
        };

        self.onEventConnectivityChanged = function(payload) {
            self.requestData({eval_notices: true});
        };

        self._resetNotifications = function() {
            self._closeAllNotifications();
            self.logContents.action.restart
                = self.logContents.action.reload
                = self.logContents.action.reconnect
                = false;
            self.logContents.steps = [];
        };

        self._closeAllNotifications = function() {
            if (self.logNotification) {
                self.logNotification.remove();
            }
            if (self.notifications) {
                _.each(self.notifications, function(notification) {
                    notification.remove();
                });
            }
        };

        self.onServerDisconnect = function() {
            self._resetNotifications();
            return true;
        };

        self.onStartup = function() {
            self.workingDialog = $("#settings_plugin_pluginmanager_workingdialog");
            self.workingOutput = $("#settings_plugin_pluginmanager_workingdialog_output");
            self.repositoryDialog = $("#settings_plugin_pluginmanager_repositorydialog");
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin !== "pluginmanager") {
                return;
            }

            if (!self.loginState.isAdmin()) {
                return;
            }

            if (!data.hasOwnProperty("type")) {
                return;
            }

            var messageType = data.type;

            if (messageType === "loglines" && self.working()) {
                _.each(data.loglines, function(line) {
                    self.loglines.push(self._preprocessLine(line));
                });
                self._scrollWorkingOutputToEnd();
            } else if (messageType === "result") {
                var action = data.action;
                var name = "Unknown";
                if (data.hasOwnProperty("plugin")) {
                    if (data.plugin !== "unknown") {
                        name = data.plugin.name;
                    }
                }

                self._displayPluginManagementNotification(data, action, name);
                self.requestData();
            }
        };

        self._forcedStdoutLine = /You are using pip version .*?, however version .*? is available\.|You should consider upgrading via the '.*?' command\./;
        self._preprocessLine = function(line) {
            if (line.stream === "stderr" && line.line.match(self._forcedStdoutLine)) {
                line.stream = "stdout";
            }
            return line;
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: PluginManagerViewModel,
        dependencies: ["loginStateViewModel", "settingsViewModel", "printerStateViewModel", "systemViewModel"],
        elements: ["#settings_plugin_pluginmanager"]
    });
});

;

// source: plugin/printer_safety_check/js/printer_safety_check.js
$(function() {
    function PrinterSafetyCheckViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.printerState = parameters[1];

        self.warnings = ko.observableArray([]);

        self.requestData = function() {
            if (!self.loginState.isUser()) {
                self.warnings([]);
                return;
            }

            OctoPrint.plugins.printer_safety_check.get()
                .done(self.fromResponse)
                .fail(function() {
                    self.warnings([]);
                });
        };

        self.fromResponse = function(data) {
            var warnings = [];
            _.each(data, function(message, warning_type) {
                warnings.push({type: warning_type, message: gettext(message)});
            });
            self.warnings(warnings);
        };

        self.onStartup = function() {
            self.requestData();
        };

        self.onUserLoggedIn = function() {
            self.requestData();
        };

        self.onUserLoggedOut = function() {
            self.requestData();
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin !== "printer_safety_check") return;
            if (!data.hasOwnProperty("type")) return;

            if (data.type === "update") {
                self.requestData();
            }
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: PrinterSafetyCheckViewModel,
        dependencies: ["loginStateViewModel", "printerStateViewModel"],
        elements: ["#sidebar_plugin_printer_safety_check_wrapper"]
    });
});


;

// source: plugin/softwareupdate/js/softwareupdate.js
$(function() {
    function SoftwareUpdateViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.printerState = parameters[1];
        self.settings = parameters[2];
        self.popup = undefined;

        self.updateInProgress = false;
        self.waitingForRestart = false;
        self.restartTimeout = undefined;

        self.currentlyBeingUpdated = [];

        self.working = ko.observable(false);
        self.workingTitle = ko.observable();
        self.workingDialog = undefined;
        self.workingOutput = undefined;
        self.loglines = ko.observableArray([]);

        self.checking = ko.observable(false);

        self.octoprintReleasedVersion = ko.observable();

        self.octoprintUnconfigured = ko.pureComputed(function() {
            return self.error_checkoutFolder();
        });
        self.octoprintUnreleased = ko.pureComputed(function() {
            return self.settings.settings.plugins.softwareupdate.octoprint_type() === "github_release"
                && !self.octoprintReleasedVersion();
        });

        self.environmentSupported = ko.observable(true);
        self.environmentVersions = ko.observableArray([]);

        self.cacheTimestamp = ko.observable();
        self.cacheTimestampText = ko.pureComputed(function() {
            return formatDate(self.cacheTimestamp());
        });

        self.config_cacheTtl = ko.observable();
        self.config_notifyUsers = ko.observable();
        self.config_checkoutFolder = ko.observable();
        self.config_checkType = ko.observable();
        self.config_releaseChannel = ko.observable();

        self.error_checkoutFolder = ko.pureComputed(function() {
            return self.config_checkType() === "git_commit"
                && (!self.config_checkoutFolder() || self.config_checkoutFolder().trim() === '');
        });

        self.enableUpdate = ko.pureComputed(function() {
            return !self.updateInProgress && self.environmentSupported();
        });

        self.enable_configSave = ko.pureComputed(function() {
            return self.config_checkType() === "github_release"
                || (self.config_checkType() === "git_commit" && !self.error_checkoutFolder());
        });

        self.configurationDialog = undefined;
        self._updateClicked = false;

        self.config_availableCheckTypes = ko.observableArray([]);
        self.config_availableReleaseChannels = ko.observableArray([]);

        self.reloadOverlay = $("#reloadui_overlay");

        self.versions = new ItemListHelper(
            "plugin.softwareupdate.versions",
            {
                "name": function(a, b) {
                    // sorts ascending, puts octoprint first
                    if (a.key.toLocaleLowerCase() === "octoprint") return -1;
                    if (b.key.toLocaleLowerCase() === "octoprint") return 1;

                    if (a.displayName.toLocaleLowerCase() < b.displayName.toLocaleLowerCase()) return -1;
                    if (a.displayName.toLocaleLowerCase() > b.displayName.toLocaleLowerCase()) return 1;
                    return 0;
                }
            },
            {},
            "name",
            [],
            [],
            5
        );

        self.availableAndPossible = ko.pureComputed(function() {
            return _.filter(self.versions.items(), function(info) { return info.updateAvailable && info.updatePossible; });
        });

        self.onUserLoggedIn = function() {
            self.performCheck();
        };

        self.onUserLoggedOut = function() {
            self._closePopup();
        };

        self._showPopup = function(options, eventListeners, singleButtonNotify) {
            singleButtonNotify = singleButtonNotify || false;

            self._closePopup();

            if (singleButtonNotify) {
                self.popup = PNotify.singleButtonNotify(options);
            } else {
                self.popup = new PNotify(options);
            }

            if (eventListeners) {
                var popupObj = self.popup.get();
                _.each(eventListeners, function(value, key) {
                    popupObj.on(key, value);
                })
            }
        };

        self._updatePopup = function(options) {
            if (self.popup === undefined) {
                self._showPopup(options);
            } else {
                self.popup.update(options);
            }
        };

        self._closePopup = function() {
            if (self.popup !== undefined) {
                self.popup.remove();
            }
        };

        self.showPluginSettings = function() {
            self._copyConfig();
            self.configurationDialog.modal();
        };

        self.savePluginSettings = function(viewModel, event) {
            var target = $(event.target);
            target.prepend('<i class="fa fa-spinner fa-spin"></i> ');

            var data = {
                plugins: {
                    softwareupdate: {
                        cache_ttl: parseInt(self.config_cacheTtl()),
                        notify_users: self.config_notifyUsers(),
                        octoprint_type: self.config_checkType(),
                        octoprint_release_channel: self.config_releaseChannel(),
                        octoprint_checkout_folder: self.config_checkoutFolder()
                    }
                }
            };
            self.settings.saveData(data, {
                success: function() {
                    self.configurationDialog.modal("hide");
                    self._copyConfig();
                    self.performCheck();
                },
                complete: function() {
                    $("i.fa-spinner", target).remove();
                },
                sending: true
            });
        };

        self._copyConfig = function() {
            var availableCheckTypes = [{"key": "github_release", "name": gettext("Release")},
                                       {"key": "git_commit", "name": gettext("Commit")}];
            self.config_availableCheckTypes(availableCheckTypes);

            var availableReleaseChannels = [];
            _.each(self.settings.settings.plugins.softwareupdate.octoprint_branch_mappings(), function(mapping) {
                availableReleaseChannels.push({"key": mapping.branch(), "name": gettext(mapping.name() || mapping.branch())});
            });
            self.config_availableReleaseChannels(availableReleaseChannels);

            self.config_cacheTtl(self.settings.settings.plugins.softwareupdate.cache_ttl());
            self.config_notifyUsers(self.settings.settings.plugins.softwareupdate.notify_users());

            self.config_checkType(self.settings.settings.plugins.softwareupdate.octoprint_type());
            self.config_releaseChannel(self.settings.settings.plugins.softwareupdate.octoprint_release_channel());
            self.config_checkoutFolder(self.settings.settings.plugins.softwareupdate.octoprint_checkout_folder());
        };

        self._copyConfigBack = function() {
            self.settings.settings.plugins.softwareupdate.octoprint_checkout_folder(self.config_checkoutFolder());
            self.settings.settings.plugins.softwareupdate.octoprint_type(self.config_checkType());
        };

        self.fromCheckResponse = function(data, ignoreSeen, showIfNothingNew) {
            self.cacheTimestamp(data.timestamp);

            var versions = [];
            _.each(data.information, function(value, key) {
                value["key"] = key;

                if (!value.hasOwnProperty("displayName") || value.displayName === "") {
                    value.displayName = value.key;
                }
                if (!value.hasOwnProperty("displayVersion") || value.displayVersion === "") {
                    value.displayVersion = value.information.local.name;
                }
                if (!value.hasOwnProperty("releaseNotes") || value.releaseNotes === "") {
                    value.releaseNotes = undefined;
                }

                var fullNameTemplate = gettext("%(name)s: %(version)s");
                value.fullNameLocal = _.sprintf(fullNameTemplate, {name: value.displayName, version: value.displayVersion});

                var fullNameRemoteVars = {name: value.displayName, version: gettext("unknown")};
                if (value.hasOwnProperty("information") && value.information.hasOwnProperty("remote") && value.information.remote.hasOwnProperty("name")) {
                    fullNameRemoteVars.version = value.information.remote.name;
                }
                value.fullNameRemote = _.sprintf(fullNameTemplate, fullNameRemoteVars);

                versions.push(value);
            });
            self.versions.updateItems(versions);

            var octoprint = data.information["octoprint"];
            self.octoprintReleasedVersion(!octoprint || octoprint.released_version);

            self.environmentSupported(data.environment.supported);
            self.environmentVersions(data.environment.versions);

            if (data.status === "inProgress") {
                self._markWorking(gettext("Updating..."), gettext("Updating, please wait."));
                return;
            }

            if (!self.loginState.isAdmin() && !self.settings.settings.plugins.softwareupdate.notify_users()) return;

            if (data.status === "updateAvailable" || data.status === "updatePossible") {
                var text = "<div class='softwareupdate_notification'>" + gettext("There are updates available for the following components:");

                text += "<ul class='fa-ul'>";
                _.each(self.versions.items(), function(update_info) {
                    if (update_info.updateAvailable) {
                        text += "<li>"
                            + "<i class='fa fa-li " + (update_info.updatePossible && self.environmentSupported() ? "fa-check" : "fa-remove")+ "'></i>"
                            + "<span class='name' title='" + update_info.fullNameRemote + "'>" + update_info.fullNameRemote + "</span>"
                            + (update_info.releaseNotes ? "<a href=\"" +  update_info.releaseNotes + "\" target=\"_blank\">" + gettext("Release Notes") + "</a>" : "")
                            + "</li>";
                    }
                });
                text += "</ul>";

                if (!self.environmentSupported()) {
                    text += "<p><small>" + gettext("This version of the Python environment is not supported for direct updates.") + "</small></p>";
                } else {
                    text += "<p><small>" + gettext("Those components marked with <i class=\"fa fa-check\"></i> can be updated directly.") + "</small></p>";
                }

                if (!self.loginState.isAdmin()) {
                    text += "<p><small>" + gettext("To have updates applied, get in touch with an administrator of this OctoPrint instance.") + "</small></p>";
                }

                text += "</div>";

                var options = {
                    title: gettext("Update Available"),
                    text: text,
                    hide: false
                };
                var eventListeners = {};

                var singleButtonNotify = false;
                if (data.status === "updatePossible" && self.loginState.isAdmin()) {
                    // if update is possible and user is admin, add action buttons for ignore and update
                    options["confirm"] = {
                        confirm: true,
                        buttons: [{
                            text: gettext("Ignore"),
                            click: function() {
                                self._markNotificationAsSeen(data.information);
                                self._showPopup({
                                    text: gettext("You can make this message display again via \"Settings\" > \"Software Update\" > \"Check for update now\"")
                                });
                            }
                        }, {
                            text: gettext("Update now"),
                            addClass: "btn-primary",
                            click: function() {
                                if (self._updateClicked) return;
                                self._updateClicked = true;
                                self.update();
                            }
                        }]
                    };
                    options["buttons"] = {
                        closer: false,
                        sticker: false
                    };
                } else {
                    // if update is not possible or user is not admin, only add ignore button
                    options["confirm"] = {
                        confirm: true,
                        buttons: [{
                            text: gettext("Ignore"),
                            click: function(notice) {
                                notice.remove();
                                self._markNotificationAsSeen(data.information);
                            }
                        }]
                    };
                    options["buttons"] = {
                        closer: false,
                        sticker: false
                    };
                    singleButtonNotify = true;
                }

                if ((ignoreSeen || !self._hasNotificationBeenSeen(data.information)) && !OctoPrint.coreui.wizardOpen) {
                    self._showPopup(options, eventListeners, singleButtonNotify);
                }
            } else if (data.status === "current") {
                if (showIfNothingNew) {
                    self._showPopup({
                        title: gettext("Everything is up-to-date"),
                        type: "success"
                    });
                } else {
                    self._closePopup();
                }
            }
        };

        self.performCheck = function(showIfNothingNew, force, ignoreSeen) {
            self.checking(true);
            OctoPrint.plugins.softwareupdate.check(force)
                .done(function(data) {
                    self.fromCheckResponse(data, ignoreSeen, showIfNothingNew);
                })
                .always(function() {
                    self.checking(false);
                });
        };

        self.iconTitleForEntry = function(data) {
            if (data.updatePossible) {
                return "";
            } else if (!data.online && data.information && data.information.needs_online) {
                return gettext("No internet connection");
            } else if (data.error) {
                return self.errorTextForEntry(data);
            } else {
                return gettext("Update not possible");
            }
        };

        self.errorTextForEntry = function(data) {
            if (!data.error) {
                return "";
            }

            switch (data.error) {
                case "unknown_check": {
                    return gettext("Unknown update check, configuration ok?");
                }
                case "needs_online": {
                    return gettext("Cannot check for update, need online connection");
                }
                case "network": {
                    return gettext("Network error while checking for update");
                }
                case "unknown": {
                    return gettext("Unknown error while checking for update, please check the logs");
                }
                default: {
                    return "";
                }
            }
        };

        self._markNotificationAsSeen = function(data) {
            if (!Modernizr.localstorage)
                return false;
            if (!self.loginState.isUser())
                return false;

            var currentString = localStorage["plugin.softwareupdate.seen_information"];
            var current;
            if (currentString === undefined) {
                current = {};
            } else {
                current = JSON.parse(currentString);
            }
            current[self.loginState.username()] = self._informationToRemoteVersions(data);
            localStorage["plugin.softwareupdate.seen_information"] = JSON.stringify(current);
        };

        self._hasNotificationBeenSeen = function(data) {
            if (!Modernizr.localstorage)
                return false;

            if (localStorage["plugin.softwareupdate.seen_information"] === undefined)
                return false;

            var knownData = JSON.parse(localStorage["plugin.softwareupdate.seen_information"]);

            if (!self.loginState.isUser())
                return true;

            var userData = knownData[self.loginState.username()];
            if (userData === undefined)
                return false;

            var freshData = self._informationToRemoteVersions(data);

            var hasBeenSeen = true;
            _.each(freshData, function(value, key) {
                if (!_.has(userData, key) || userData[key] !== freshData[key]) {
                    hasBeenSeen = false;
                }
            });
            return hasBeenSeen;
        };

        self._informationToRemoteVersions = function(data) {
            var result = {};
            _.each(data, function(value, key) {
                result[key] = value.information.remote.value;
            });
            return result;
        };

        self.performUpdate = function(force, items) {
            if (!self.loginState.isAdmin()) return;
            if (self.printerState.isPrinting()) return;

            self.updateInProgress = true;

            var options = {
                title: gettext("Updating..."),
                text: gettext("Now updating, please wait."),
                icon: "fa fa-cog fa-spin",
                hide: false,
                buttons: {
                    closer: false,
                    sticker: false
                }
            };
            self._showPopup(options);

            OctoPrint.plugins.softwareupdate.update(items, force)
                .done(function(data) {
                    self.currentlyBeingUpdated = data.checks;
                    self._markWorking(gettext("Updating..."), gettext("Updating, please wait."));
                })
                .fail(function() {
                    self.updateInProgress = false;
                    self._showPopup({
                        title: gettext("Update not started!"),
                        text: gettext("The update could not be started. Is it already active? Please consult octoprint.log for details."),
                        type: "error",
                        hide: false,
                        buttons: {
                            sticker: false
                        }
                    });
                });
        };

        self.update = function(force, items) {
            if (self.updateInProgress) {
                self._updateClicked = false;
                return;
            }
            if (!self.loginState.isAdmin()) {
                self._updateClicked = false;
                return;
            }

            if (items === undefined) {
                items = self.availableAndPossible();
            }

            if (self.printerState.isPrinting()) {
                self._showPopup({
                    title: gettext("Can't update while printing"),
                    text: gettext("A print job is currently in progress. Updating will be prevented until it is done."),
                    type: "error"
                });
                self._updateClicked = false;
            } else {
                var html = "<p>" + gettext("This will update the following components and restart the server:") + "</p>";
                html += "<ul>";
                _.each(items, function(item) {
                    html += "<li>"
                        + "<span class=\"name\" title=\"" + item.fullNameRemote + "\">" + item.fullNameRemote + "</span>";
                    if (item.releaseNotes) {
                        html += "<br><a href=\"" + item.releaseNotes + "\" target=\"_blank\" rel=\"noreferrer noopener\">" + gettext("Release Notes") + "</a>"
                    }
                    html += "</li>";
                });
                html += "</ul>";
                html += "<p>" + gettext("Be sure to read through any linked release notes, especially those for OctoPrint since they might contain important information you need to know <strong>before</strong> upgrading.") + "</p>"
                    + "<p><strong>" + gettext("This action may disrupt any ongoing print jobs.") + "</strong></p>"
                    + "<p>" + gettext("Depending on your printer's controller and general setup, restarting OctoPrint may cause your printer to be reset.") + "</p>"
                    + "<p>" + gettext("Are you sure you want to proceed?") + "</p>";
                showConfirmationDialog({
                    title: gettext("Are you sure you want to update now?"),
                    html: html,
                    proceed: gettext("Proceed"),
                    onproceed: function() {
                        self.performUpdate((force === true),
                                           _.map(items, function(info) { return info.key }));
                    },
                    onclose: function() {
                        self._updateClicked = false;
                    }
                });
            }

        };

        self._showWorkingDialog = function(title) {
            if (!self.loginState.isAdmin() && !self.loginState.isUser()) {
                return;
            }

            self.working(true);
            self.workingTitle(title);
            self.workingDialog.modal({keyboard: false, backdrop: "static", show: true});
        };

        self._markWorking = function(title, line, stream) {
            if (stream === undefined) {
                stream = "message";
            }

            self.loglines.removeAll();
            self.loglines.push({line: line, stream: stream});
            self._showWorkingDialog(title);
        };

        self._markDone = function(line, stream) {
            if (stream === undefined) {
                stream = "message";
            }

            self.working(false);
            self.loglines.push({line: "", stream: stream});
            self.loglines.push({line: line, stream: stream});
            self._scrollWorkingOutputToEnd();
        };

        self._scrollWorkingOutputToEnd = function() {
            self.workingOutput.scrollTop(self.workingOutput[0].scrollHeight - self.workingOutput.height());
        };

        self.onBeforeWizardTabChange = function(next, current) {
            if (next && next === "#wizard_plugin_softwareupdate") {
                // switching to the plugin wizard tab
                self._copyConfig();
            } else if (current && current === "#wizard_plugin_softwareupdate") {
                // switching away from the plugin wizard tab
                self._copyConfigBack();
            }

            return true;
        };

        self.onAfterWizardFinish = function() {
            // we might have changed our config, so we need to refresh our check data from the server
            self.performCheck();
        };

        self.onStartup = function() {
            self.workingDialog = $("#settings_plugin_softwareupdate_workingdialog");
            self.workingOutput = $("#settings_plugin_softwareupdate_workingdialog_output");
            self.configurationDialog = $("#settings_plugin_softwareupdate_configurationdialog");
        };

        self.onServerDisconnect = function() {
            if (self.restartTimeout !== undefined) {
                clearTimeout(self.restartTimeout);
            }
            return true;
        };

        self.onEventConnectivityChanged = function(payload) {
            if (!payload || !payload.new) return;
            self.performCheck();
        };

        self.onDataUpdaterReconnect = function() {
            if (self.waitingForRestart) {
                self.waitingForRestart = false;
                self.updateInProgress = false;
                if (!self.reloadOverlay.is(":visible")) {
                    self.reloadOverlay.show();
                }
            }
        };

        self.onDataUpdaterPluginMessage = function(plugin, data) {
            if (plugin !== "softwareupdate") {
                return;
            }

            var messageType = data.type;
            var messageData = data.data;

            var options = undefined;

            var restartType = undefined;
            var title = undefined;
            var text = undefined;

            switch(messageType) {
                // make sure we are marked as working if we get any of the in-progress messages
                case "loglines":
                case "updating":
                case "restarting":
                case "restart_manually":
                case "restart_failed":
                case "success":
                case "error": {
                    if (!self.working()) {
                        self._markWorking(gettext("Updating..."), gettext("Updating, please wait."));
                    }
                    break;
                }
            }

            switch (messageType) {
                case "loglines": {
                    _.each(messageData.loglines, function(line) {
                        self.loglines.push(self._preprocessLine(line));
                    });
                    self._scrollWorkingOutputToEnd();
                    break;
                }
                case "updating": {
                    console.log(JSON.stringify(messageData));

                    text = _.sprintf(gettext("Now updating %(name)s to %(version)s"), {name: messageData.name, version: messageData.version});
                    self.loglines.push({line: "", stream: "separator"});
                    self.loglines.push({line: _.repeat("+", text.length), stream: "separator"});
                    self.loglines.push({line: text, stream: "message"});
                    self.loglines.push({line: _.repeat("+", text.length), stream: "separator"});
                    self._scrollWorkingOutputToEnd();
                    self._updatePopup({
                        text: text,
                        hide: false,
                        buttons: {
                            sticker: false
                        }
                    });

                    break;
                }
                case "restarting": {
                    console.log(JSON.stringify(messageData));

                    title = gettext("Update successful, restarting!");
                    text = gettext("The update finished successfully and the server will now be restarted.");

                    options = {
                        title: title,
                        text: text,
                        type: "success",
                        hide: false,
                        buttons: {
                            sticker: false
                        }
                    };

                    self.loglines.push({line: text, stream: "message"});
                    self._scrollWorkingOutputToEnd();

                    self.waitingForRestart = true;
                    self.restartTimeout = setTimeout(function() {
                        title = gettext("Restart failed");
                        text = gettext("The server apparently did not restart by itself, you'll have to do it manually. Please consult octoprint.log on what went wrong.");

                        self._showPopup({
                            title: title,
                            text: text,
                            type: "error",
                            hide: false,
                            buttons: {
                                sticker: false
                            }
                        });
                        self.waitingForRestart = false;

                        self._markDone(text, "message_error");
                    }, 60000);

                    break;
                }
                case "restart_manually": {
                    console.log(JSON.stringify(messageData));

                    restartType = messageData.restart_type;
                    text = gettext("The update finished successfully, please restart OctoPrint now.");
                    if (restartType === "environment") {
                        text = gettext("The update finished successfully, please reboot the server now.");
                    }

                    title = gettext("Update successful, restart required!");
                    options = {
                        title: title,
                        text: text,
                        type: "success",
                        hide: false,
                        buttons: {
                            sticker: false
                        }
                    };
                    self.updateInProgress = false;
                    self._markDone(text);
                    break;
                }
                case "restart_failed": {
                    restartType = messageData.restart_type;
                    text = gettext("Restarting OctoPrint failed, please restart it manually. You might also want to consult octoprint.log on what went wrong here.");
                    if (restartType === "environment") {
                        text = gettext("Rebooting the server failed, please reboot it manually. You might also want to consult octoprint.log on what went wrong here.");
                    }

                    title = gettext("Restart failed");
                    options = {
                        title: title,
                        test: text,
                        type: "error",
                        hide: false,
                        buttons: {
                            sticker: false
                        }
                    };
                    self.waitingForRestart = false;
                    self.updateInProgress = false;
                    self._markDone(text, "message_error");
                    break;
                }
                case "success": {
                    title = gettext("Update successful!");
                    text = gettext("The update finished successfully.");
                    options = {
                        title: title,
                        text: text,
                        type: "success",
                        hide: false,
                        buttons: {
                            sticker: false
                        }
                    };
                    self.updateInProgress = false;
                    self._markDone(text);
                    break;
                }
                case "error": {
                    title = gettext("Update failed!");
                    text = gettext("The update did not finish successfully. Please consult <code>octoprint.log</code> and <code>plugin_softwareupdate_console.log</code> for details.");
                    self._showPopup({
                        title: title,
                        text: text,
                        type: "error",
                        hide: false,
                        buttons: {
                            sticker: false
                        }
                    });
                    self.updateInProgress = false;
                    self._markDone(text, "message_error");
                    break;
                }
                case "update_versions": {
                    self.performCheck();
                    break;
                }
            }

            if (options !== undefined) {
                self._showPopup(options);
            }
        };

        self._forcedStdoutPatterns = ["You are using pip version .*?, however version .*? is available\.",
                                      "You should consider upgrading via the '.*?' command\.",
                                      "'.*?' does not exist -- can't clean it"];
        self._forcedStdoutLine = new RegExp(self._forcedStdoutPatterns.join("|"));
        self._preprocessLine = function(line) {
            if (line.stream === "stderr" && line.line.match(self._forcedStdoutLine)) {
                line.stream = "stdout";
            }
            return line;
        }
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: SoftwareUpdateViewModel,
        dependencies: ["loginStateViewModel", "printerStateViewModel", "settingsViewModel"],
        elements: ["#settings_plugin_softwareupdate", "#softwareupdate_confirmation_dialog", "#wizard_plugin_softwareupdate"]
    });
});

;

// source: plugin/tracking/js/usage.js
$(function() {
    function UsageViewModel(parameters) {
        var self = this;

        self.settingsViewModel = parameters[0];

        self.setup = ko.observable(false);

        self.decision = ko.observable();
        self.active = ko.observable();
        self.required = false;

        self.enableUsage = function() {
            self.settingsViewModel.settings.plugins.tracking.enabled(true);
            self.decision(true);
            self._sendData();
        };

        self.disableUsage = function() {
            self.settingsViewModel.settings.plugins.tracking.enabled(false);
            self.decision(false);
            self._sendData();
        };

        self.onBeforeWizardTabChange = function(next, current) {
            if (!self.required) return true;

            if (!current || !_.startsWith(current, "wizard_plugin_tracking") || self.setup()) {
                return true;
            }

            self._showDecisionNeededDialog();
            return false;
        };

        self.onBeforeWizardFinish = function() {
            if (!self.required) return true;

            if (self.setup()) {
                return true;
            }

            self._showDecisionNeededDialog();
            return false;
        };

        self.onWizardPreventSettingsRefreshDialog = function() {
            return self.active();
        };

        self.onWizardDetails = function(response) {
            self.required = response && response.tracking && response.tracking.required;
        };

        self._showDecisionNeededDialog = function() {
            showMessageDialog({
                title: gettext("Please set up anonymous usage tracking"),
                message: gettext("You haven't yet decided on whether to enable or disable anonymous usage tracking. You need to either enable or disable it before continuing.")
            });
        };

        self._sendData = function() {
            var data = {
                plugins: {
                    tracking: {
                        enabled: self.settingsViewModel.settings.plugins.tracking.enabled()
                    }
                }
            };

            self.active(true);
            self.settingsViewModel.saveData(data)
                .done(function() {
                    self.setup(true);
                    self.active(false);
                })
                .fail(function() {
                    self.decision(false);
                    self.setup(true);
                    self.active(false);

                    var message = gettext("Please open a <a href='%(bugreport)s' target='_blank' rel='noopener noreferrer'>" +
                            "bug report</a> on this. Make sure to include all requested information, including your " +
                            "<a href='%(jsconsole)s' target='_blank' rel='noopener noreferrer'>JS console</a> and " +
                            "<code>octoprint.log</code>.");
                    new PNotify({
                        title: gettext("Something went wrong"),
                        text: _.sprintf(message, {bugreport: "https://github.com/foosel/OctoPrint/blob/master/CONTRIBUTING.md#how-to-file-a-bug-report", jsconsole: "https://webmasters.stackexchange.com/a/77337"}),
                        type: "error",
                        hide: false
                    });
                });
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        UsageViewModel,
        ["settingsViewModel"],
        "#wizard_plugin_tracking"
    ]);
});

;

// source: js/app/dataupdater.js
function DataUpdater(allViewModels, connectCallback, disconnectCallback) {
    var self = this;

    self.allViewModels = allViewModels;
    self.connectCallback = connectCallback;
    self.disconnectCallback = disconnectCallback;

    self._pluginHash = undefined;
    self._configHash = undefined;

    self._connectedDeferred = undefined;

    self._initializedDeferred = undefined;

    self._throttleFactor = 1;
    self._baseProcessingLimit = 500.0;
    self._lastProcessingTimes = [];
    self._lastProcessingTimesSize = 20;

    self._safeModePopup = undefined;

    self.increaseThrottle = function() {
        self.setThrottle(self._throttleFactor + 1);
    };

    self.decreaseThrottle = function() {
        if (self._throttleFactor <= 1) {
            return;
        }
        self.setThrottle(self._throttleFactor - 1);
    };

    self.setThrottle = function(throttle) {
        self._throttleFactor = throttle;

        self._send("throttle", self._throttleFactor);
        log.debug("DataUpdater: New SockJS throttle factor:", self._throttleFactor, " new processing limit:", self._baseProcessingLimit * self._throttleFactor);
    };

    self._send = function(message, data) {
        var payload = {};
        payload[message] = data;
        self._socket.send(JSON.stringify(payload));
    };

    self.connect = function() {
        if (self._connectedDeferred) {
            self._connectedDeferred.reject();
        }
        self._connectedDeferred = $.Deferred();
        OctoPrint.socket.connect({debug: !!SOCKJS_DEBUG});
        return self._connectedDeferred.promise();
    };

    self.reconnect = function() {
        if (self._connectedDeferred) {
            self._connectedDeferred.reject();
        }
        self._connectedDeferred = $.Deferred();
        OctoPrint.socket.reconnect();
        return self._connectedDeferred.promise();
    };

    self.initialized = function() {
        if (self._initializedDeferred) {
            self._initializedDeferred.resolve();
            self._initializedDeferred = undefined;
        }
    };

    self._onReconnectAttempt = function(trial) {
        if (trial <= 0) {
            // Only consider it a real disconnect if the trial number has exceeded our threshold.
            return;
        }

        var handled = false;
        callViewModelsIf(
            self.allViewModels,
            "onServerDisconnect",
            function() { return !handled; },
            function(method) { var result = method(); handled = (result !== undefined && !result) || handled; }
        );

        if (handled) {
            return true;
        }

        showOfflineOverlay(
            gettext("Server is offline"),
            gettext("The server appears to be offline, at least I'm not getting any response from it. I'll try to reconnect automatically <strong>over the next couple of minutes</strong>, however you are welcome to try a manual reconnect anytime using the button below."),
            self.reconnect
        );
    };

    self._onReconnectFailed = function() {
        var handled = false;
        callViewModelsIf(
            self.allViewModels,
            "onServerDisconnect",
            function() { return !handled; },
            function(method) { var result = method(); handled = (result !== undefined && !result) || handled; }
        );

        if (handled) {
            return;
        }

        $("#offline_overlay_title").text(gettext("Server is offline"));
        $("#offline_overlay_message").html(gettext("The server appears to be offline, at least I'm not getting any response from it. I <strong>could not reconnect automatically</strong>, but you may try a manual reconnect using the button below."));
    };

    self._onDisconnected = function(code) {
        if (self._initializedDeferred) {
            self._initializedDeferred.reject();
        }
        self._initializedDeferred = undefined;

        if (self.disconnectCallback) {
            self.disconnectCallback();
        }
    };

    self._onConnectMessage = function(event) {
        if (self._initializedDeferred) {
            self._initializedDeferred.reject();
        }
        self._initializedDeferred = $.Deferred();

        if (self.connectCallback) {
            self.connectCallback();
        }

        var data = event.data;

        // update version information
        var oldVersion = VERSION;
        VERSION = data["version"];
        DISPLAY_VERSION = data["display_version"];
        BRANCH = data["branch"];
        $("span.version").text(DISPLAY_VERSION);

        // update plugin hash
        var oldPluginHash = self._pluginHash;
        self._pluginHash = data["plugin_hash"];

        // update config hash
        var oldConfigHash = self._configHash;
        self._configHash = data["config_hash"];

        self._ifInitialized(function() {
            // process safe mode
            if (self._safeModePopup) self._safeModePopup.remove();
            if (data["safe_mode"]) {
                // safe mode is active, let's inform the user
                log.info("Safe mode is active. Third party plugins are disabled and cannot be enabled.");

                self._safeModePopup = new PNotify({
                    title: gettext("Safe mode is active"),
                    text: gettext("The server is currently running in safe mode. Third party plugins are disabled and cannot be enabled."),
                    hide: false
                });
            }

            // if the offline overlay is still showing, now's a good time to
            // hide it, plus reload the camera feed if it's currently displayed
            if ($("#offline_overlay").is(":visible")) {
                hideOfflineOverlay();
                callViewModels(self.allViewModels, "onServerReconnect");
                callViewModels(self.allViewModels, "onDataUpdaterReconnect");
            } else {
                callViewModels(self.allViewModels, "onServerConnect");
            }

            // if the version, the plugin hash or the config hash changed, we
            // want the user to reload the UI since it might be stale now
            var versionChanged = oldVersion !== VERSION;
            var pluginsChanged = oldPluginHash !== undefined && oldPluginHash !== self._pluginHash;
            var configChanged = oldConfigHash !== undefined && oldConfigHash !== self._configHash;
            if (versionChanged || pluginsChanged || configChanged) {
                showReloadOverlay();
            }

        });

        log.info("Connected to the server");

        // if we have a connected promise, resolve it now
        if (self._connectedDeferred) {
            self._connectedDeferred.resolve();
            self._connectedDeferred = undefined;
        }
    };

    self._onHistoryData = function(event) {
        self._ifInitialized(function() {
            callViewModels(self.allViewModels, "fromHistoryData", [event.data]);
        });
    };

    self._onCurrentData = function(event) {
        self._ifInitialized(function() {
            callViewModels(self.allViewModels, "fromCurrentData", [event.data]);
        });
    };

    self._onSlicingProgress = function(event) {
        self._ifInitialized(function() {
            $("#gcode_upload_progress").find(".bar").text(_.sprintf(gettext("Slicing ... (%(percentage)d%%)"), {percentage: Math.round(event.data["progress"])}));

            var data = event.data;
            callViewModels(self.allViewModels, "onSlicingProgress", [
                data["slicer"],
                data["model_path"],
                data["machinecode_path"],
                data["progress"]
            ]);
        });
    };

    self._printerErrorCancelNotification = undefined;
    self._printerErrorDisconnectNotification = undefined;
    self._printerResetNotification = undefined;
    self._onEvent = function(event) {
        self._ifInitialized(function() {
            var type = event.data["type"];
            var payload = event.data["payload"];

            log.debug("Got event " + type + " with payload: " + JSON.stringify(payload));

            if (type === "PrintCancelling" && payload.firmwareError) {
                if (self._printerErrorCancelNotification !== undefined) {
                    self._printerErrorCancelNotification.remove();
                }
                self._printerErrorCancelNotification = new PNotify({
                    title: gettext("Error reported by printer"),
                    text: _.sprintf(gettext("Your printer's firmware reported an error. Due to that the ongoing print job will be cancelled. Reported error: %(firmwareError)s"), payload),
                    type: "error",
                    hide: false
                });
            } else if (type === "Error" && payload.error) {
                var title = undefined,
                    text = undefined;

                switch (payload.reason) {
                    case "firmware": {
                        title = gettext("Error reported by printer");
                        text = _.sprintf(gettext("Your printer's firmware reported an error. Due to that OctoPrint will disconnect. Reported error: %(error)s"), payload);
                        break;
                    }
                    case "resend":
                    case "timeout": {
                        title = gettext("Communication error");
                        text = _.sprintf(gettext("There was a communication error while talking to your printer. Please consult the terminal output and octoprint.log for details. Error: %(error)s"), payload);
                        break;
                    }
                    case "connection": {
                        title = gettext("Error connecting to printer");
                        text = _.sprintf(gettext("There was an error while trying to connect to your printer. Error: %(error)s"), payload);
                        break;
                    }
                    case "start_print": {
                        title = gettext("Error starting a print");
                        text = _.sprintf(gettext("There was an error while trying to start a print job. Error: %(error)s"), payload);
                        break;
                    }
                    case "autodetect_port":
                    case "autodetect_baudrate": {
                        // ignore
                        break;
                    }
                    default: {
                        title = gettext("Unknown error");
                        text = _.sprintf(gettext("There was an unknown error while talking to your printer. Please consult the terminal output and octoprint.log for details. Error: %(error)s"), payload);
                        break;
                    }
                }

                if (title && text) {
                    if (self._printerErrorDisconnectNotification !== undefined) {
                        self._printerErrorDisconnectNotification.remove();
                    }
                    self._printerErrorDisconnectNotification = new PNotify({
                            title: title,
                            text: text,
                            type: "error",
                            hide: false
                    });
                }
            } else if (type === "PrinterReset") {
                var severity = undefined,
                    text = undefined;
                if (payload.idle) {
                    text = gettext("It looks like your printer reset while a connection was active. If this was intentional you may safely ignore this message. Otherwise you should investigate why your printer reset itself, since this will interrupt prints and also file transfers to your printer's SD.");
                    severity = "alert";
                } else {
                    text = gettext("It looks like your printer reset while a connection was active. Due to this the ongoing job was aborted. If this was intentional you may safely ignore this message. Otherwise you should investigate why your printer reset itself, since this will interrupt prints and also file transfers to your printer's SD.");
                    severity = "error";
                }

                if (self._printerResetNotification !== undefined) {
                    self._printerResetNotification.remove();
                }
                self._printerResetNotification = new PNotify({
                    title: gettext("Printer reset detected"),
                    text: text,
                    type: severity,
                    hide: false
                });
            }

            var legacyEventHandlers = {
                "UpdatedFiles": "onUpdatedFiles",
                "MetadataStatisticsUpdated": "onMetadataStatisticsUpdated",
                "MetadataAnalysisFinished": "onMetadataAnalysisFinished",
                "SlicingDone": "onSlicingDone",
                "SlicingCancelled": "onSlicingCancelled",
                "SlicingFailed": "onSlicingFailed"
            };
            _.each(self.allViewModels, function(viewModel) {
                if (viewModel.hasOwnProperty("onEvent" + type)) {
                    viewModel["onEvent" + type](payload);
                } else if (legacyEventHandlers.hasOwnProperty(type) && viewModel.hasOwnProperty(legacyEventHandlers[type])) {
                    // there might still be code that uses the old callbacks, make sure those still get called
                    // but log a warning
                    log.warn("View model " + viewModel.name + " is using legacy event handler " + legacyEventHandlers[type] + ", new handler is called " + legacyEventHandlers[type]);
                    viewModel[legacyEventHandlers[type]](payload);
                }
            });
        })
    };

    self._onTimelapse = function(event) {
        self._ifInitialized(function() {
            callViewModels(self.allViewModels, "fromTimelapseData", [event.data]);
        })
    };

    self._onPluginMessage = function(event) {
        self._ifInitialized(function() {
            callViewModels(self.allViewModels, "onDataUpdaterPluginMessage", [event.data.plugin, event.data.data]);
        })
    };

    self._onReauthMessage = function(event) {
        self._ifInitialized(function() {
            callViewModels(self.allViewModels, "onDataUpdaterReauthRequired", [event.data.reason]);
        })
    };

    self._onIncreaseRate = function(measurement, minimum) {
        log.debug("We are fast (" + measurement + " < " + minimum + "), increasing refresh rate");
        OctoPrint.socket.increaseRate();
    };

    self._onDecreaseRate = function(measurement, maximum) {
        log.debug("We are slow (" + measurement + " > " + maximum + "), reducing refresh rate");
        OctoPrint.socket.decreaseRate();
    };

    self._ifInitialized = function(callback) {
        if (self._initializedDeferred) {
            self._initializedDeferred.done(callback);
        } else {
            callback();
        }
    };

    OctoPrint.socket.onDisconnected = self._onDisconnected;
    OctoPrint.socket.onReconnectAttempt = self._onReconnectAttempt;
    OctoPrint.socket.onReconnectFailed = self._onReconnectFailed;
    OctoPrint.socket.onRateTooHigh = self._onDecreaseRate;
    OctoPrint.socket.onRateTooLow = self._onIncreaseRate;
    OctoPrint.socket
        .onMessage("connected", self._onConnectMessage)
        .onMessage("history", self._onHistoryData)
        .onMessage("current", self._onCurrentData)
        .onMessage("slicingProgress", self._onSlicingProgress)
        .onMessage("event", self._onEvent)
        .onMessage("timelapse", self._onTimelapse)
        .onMessage("plugin", self._onPluginMessage)
        .onMessage("reauthRequired", self._onReauthMessage);
}

;

// source: js/app/helpers.js
function ItemListHelper(listType, supportedSorting, supportedFilters, defaultSorting, defaultFilters, exclusiveFilters, defaultPageSize) {
    var self = this;

    self.listType = listType;
    self.supportedSorting = supportedSorting;
    self.supportedFilters = supportedFilters;
    self.defaultSorting = defaultSorting;
    self.defaultFilters = defaultFilters;
    self.exclusiveFilters = exclusiveFilters;
    self.defaultPageSize = defaultPageSize;

    self.searchFunction = undefined;

    self.allItems = [];
    self.allSize = ko.observable(0);

    self.items = ko.observableArray([]);
    self.pageSize = ko.observable(self.defaultPageSize);
    self.currentPage = ko.observable(0);
    self.currentSorting = ko.observable(self.defaultSorting);
    self.currentFilters = ko.observableArray(self.defaultFilters);
    self.selectedItem = ko.observable(undefined);

    self.storageIds = {
        "currentSorting": self.listType + "." + "currentSorting",
        "currentFilters": self.listType + "." + "currentFilters",
        "pageSize": self.listType + "." + "pageSize",
    };

    //~~ item handling

    self.refresh = function() {
        self._updateItems();
    };

    self.updateItems = function(items) {
        if (items === undefined) items = [];
        self.allItems = items;
        self.allSize(items.length);
        self._updateItems();
    };

    self.selectItem = function(matcher) {
        var itemList = self.items();
        for (var i = 0; i < itemList.length; i++) {
            if (matcher(itemList[i])) {
                self.selectedItem(itemList[i]);
                break;
            }
        }
    };

    self.selectNone = function() {
        self.selectedItem(undefined);
    };

    self.isSelected = function(data) {
        return self.selectedItem() == data;
    };

    self.isSelectedByMatcher = function(matcher) {
        return matcher(self.selectedItem());
    };

    self.removeItem = function(matcher) {
        var index = self.getIndex(matcher, true);
        if (index > -1) {
            self.allItems.splice(index, 1);
            self._updateItems();
        }
    };

    self.updateItem = function(matcher, item) {
        var index = self.allItems.findIndex(matcher);
        if (index > -1) {
            self.allItems[index] = item;
            self._updateItems();
        }
    };

    self.addItem = function(item) {
        self.allItems.push(item);
        self._updateItems();
    }

    //~~ pagination

    self.paginatedItems = ko.dependentObservable(function() {
        if (self.items() == undefined) {
            return [];
        } else if (self.pageSize() == 0) {
            return self.items();
        } else {
            var from = Math.max(self.currentPage() * self.pageSize(), 0);
            var to = Math.min(from + self.pageSize(), self.items().length);
            return self.items().slice(from, to);
        }
    });
    self.lastPage = ko.dependentObservable(function() {
        return (self.pageSize() == 0 ? 1 : Math.ceil(self.items().length / self.pageSize()) - 1);
    });
    self.pages = ko.dependentObservable(function() {
        var pages = [];
        if (self.pageSize() == 0) {
            pages.push({ number: 0, text: 1 });
        } else if (self.lastPage() < 7) {
            for (var i = 0; i < self.lastPage() + 1; i++) {
                pages.push({ number: i, text: i+1 });
            }
        } else {
            pages.push({ number: 0, text: 1 });
            if (self.currentPage() < 5) {
                for (var i = 1; i < 5; i++) {
                    pages.push({ number: i, text: i+1 });
                }
                pages.push({ number: -1, text: "…"});
            } else if (self.currentPage() > self.lastPage() - 5) {
                pages.push({ number: -1, text: "…"});
                for (var i = self.lastPage() - 4; i < self.lastPage(); i++) {
                    pages.push({ number: i, text: i+1 });
                }
            } else {
                pages.push({ number: -1, text: "…"});
                for (var i = self.currentPage() - 1; i <= self.currentPage() + 1; i++) {
                    pages.push({ number: i, text: i+1 });
                }
                pages.push({ number: -1, text: "…"});
            }
            pages.push({ number: self.lastPage(), text: self.lastPage() + 1})
        }
        return pages;
    });

    self.switchToItem = function(matcher) {
        var pos = -1;
        var itemList = self.items();
        for (var i = 0; i < itemList.length; i++) {
            if (matcher(itemList[i])) {
                pos = i;
                break;
            }
        }

        if (pos > -1) {
            var page = Math.floor(pos / self.pageSize());
            self.changePage(page);
        }
    };

    self.changePage = function(newPage) {
        if (newPage < 0 || newPage > self.lastPage())
            return;
        self.currentPage(newPage);
    };    self.prevPage = function() {
        if (self.currentPage() > 0) {
            self.currentPage(self.currentPage() - 1);
        }
    };
    self.nextPage = function() {
        if (self.currentPage() < self.lastPage()) {
            self.currentPage(self.currentPage() + 1);
        }
    };

    self.getIndex = function(matcher, all) {
        var itemList;
        if (all !== undefined && all === true) {
            itemList = self.allItems;
        } else {
            itemList = self.items();
        }

        for (var i = 0; i < itemList.length; i++) {
            if (matcher(itemList[i])) {
                return i;
            }
        }
        return -1;
    }

    self.getItem = function(matcher, all) {
        var index = self.getIndex(matcher, all);
        if (all !== undefined && all === true) {
            return index > -1 ? self.allItems[index] : undefined;
        } else {
            return index > -1 ? self.items()[index] : undefined;
        }
    };

    self.resetPage = function() {
        if (self.currentPage() > self.lastPage()) {
            self.currentPage(self.lastPage());
        }
    };

    //~~ searching

    self.changeSearchFunction = function(searchFunction) {
        self.searchFunction = searchFunction;
        self.changePage(0);
        self._updateItems();
    };

    self.resetSearch = function() {
        self.changeSearchFunction(undefined);
    };

    //~~ sorting

    self.changeSorting = function(sorting) {
        if (!_.contains(_.keys(self.supportedSorting), sorting))
            return;

        self.currentSorting(sorting);
        self._saveCurrentSortingToLocalStorage();

        self.changePage(0);
        self._updateItems();
    };

    //~~ filtering

    self.toggleFilter = function(filter) {
        if (!_.contains(_.keys(self.supportedFilters), filter))
            return;

        if (_.contains(self.currentFilters(), filter)) {
            self.removeFilter(filter);
        } else {
            self.addFilter(filter);
        }
    };

    self.addFilter = function(filter) {
        if (!_.contains(_.keys(self.supportedFilters), filter))
            return;

        for (var i = 0; i < self.exclusiveFilters.length; i++) {
            if (_.contains(self.exclusiveFilters[i], filter)) {
                for (var j = 0; j < self.exclusiveFilters[i].length; j++) {
                    if (self.exclusiveFilters[i][j] == filter)
                        continue;
                    self.removeFilter(self.exclusiveFilters[i][j]);
                }
            }
        }

        var filters = self.currentFilters();
        filters.push(filter);
        self.currentFilters(filters);
        self._saveCurrentFiltersToLocalStorage();

        self.changePage(0);
        self._updateItems();
    };

    self.removeFilter = function(filter) {
        if (!_.contains(_.keys(self.supportedFilters), filter))
            return;

        var filters = self.currentFilters();
        filters = _.without(filters, filter);
        self.currentFilters(filters);
        self._saveCurrentFiltersToLocalStorage();

        self.changePage(0);
        self._updateItems();
    };

    //~~ update for sorted and filtered view

    self._updateItems = function() {
        // determine comparator
        var comparator = undefined;
        var currentSorting = self.currentSorting();
        if (typeof currentSorting !== 'undefined' && typeof self.supportedSorting[currentSorting] !== 'undefined') {
            comparator = self.supportedSorting[currentSorting];
        }

        // work on all items
        var result = self.allItems;

        // filter if necessary
        var filters = self.currentFilters();
        _.each(filters, function(filter) {
            if (typeof filter !== 'undefined' && typeof supportedFilters[filter] !== 'undefined')
                result = _.filter(result, supportedFilters[filter]);
        });

        // search if necessary
        if (typeof self.searchFunction !== 'undefined' && self.searchFunction) {
            result = _.filter(result, self.searchFunction);
        }

        // sort if necessary
        if (typeof comparator !== 'undefined')
            result.sort(comparator);

        // set result list
        self.items(result);
    };

    //~~ local storage

    self._saveCurrentSortingToLocalStorage = function() {
        if ( self._initializeLocalStorage() ) {
            var currentSorting = self.currentSorting();
            if (currentSorting !== undefined)
                localStorage[self.storageIds.currentSorting] = currentSorting;
            else
                localStorage[self.storageIds.currentSorting] = undefined;
        }
    };

    self._loadCurrentSortingFromLocalStorage = function() {
        if ( self._initializeLocalStorage() ) {
            if (_.contains(_.keys(supportedSorting), localStorage[self.storageIds.currentSorting]))
                self.currentSorting(localStorage[self.storageIds.currentSorting]);
            else
                self.currentSorting(defaultSorting);
        }
    };

    self._saveCurrentFiltersToLocalStorage = function() {
        if ( self._initializeLocalStorage() ) {
            var filters = _.intersection(_.keys(self.supportedFilters), self.currentFilters());
            localStorage[self.storageIds.currentFilters] = JSON.stringify(filters);
        }
    };

    self._loadCurrentFiltersFromLocalStorage = function() {
        if ( self._initializeLocalStorage() ) {
            self.currentFilters(_.intersection(_.keys(self.supportedFilters), JSON.parse(localStorage[self.storageIds.currentFilters])));
        }
    };

    self._savePageSizeToLocalStorage = function(pageSize) {
        if (self._initializeLocalStorage()) {
            localStorage[self.storageIds.pageSize] = pageSize;
        }
    }

    self.pageSize.subscribe(self._savePageSizeToLocalStorage);

    self._loadPageSizeFromLocalStorage = function() {
        if (self._initializeLocalStorage) {
            self.pageSize(parseInt(localStorage[self.storageIds.pageSize]));
        }
    }

    self._initializeLocalStorage = function() {
        if (!Modernizr.localstorage)
            return false;

        if (localStorage[self.storageIds.currentSorting] !== undefined && localStorage[self.storageIds.currentFilters] !== undefined && JSON.parse(localStorage[self.storageIds.currentFilters]) instanceof Array && localStorage[self.storageIds.pageSize] !== undefined)
            return true;

        localStorage[self.storageIds.currentSorting] = self.defaultSorting;
        localStorage[self.storageIds.currentFilters] = JSON.stringify(self.defaultFilters);
        localStorage[self.storageIds.pageSize] = self.defaultPageSize;

        return true;
    };

    self._loadCurrentFiltersFromLocalStorage();
    self._loadCurrentSortingFromLocalStorage();
    self._loadPageSizeFromLocalStorage();
}

function formatSize(bytes) {
    if (!bytes) return "-";

    var units = ["bytes", "KB", "MB", "GB"];
    for (var i = 0; i < units.length; i++) {
        if (bytes < 1024) {
            return _.sprintf("%3.1f%s", bytes, units[i]);
        }
        bytes /= 1024;
    }
    return _.sprintf("%.1f%s", bytes, "TB");
}

function bytesFromSize(size) {
    if (size == undefined || size.trim() == "") return undefined;

    var parsed = size.match(/^([+]?[0-9]*\.?[0-9]+)(?:\s*)?(.*)$/);
    var number = parsed[1];
    var unit = parsed[2].trim();

    if (unit == "") return parseFloat(number);

    var units = {
        b: 1,
        byte: 1,
        bytes: 1,
        kb: 1024,
        mb: Math.pow(1024, 2),
        gb: Math.pow(1024, 3),
        tb: Math.pow(1024, 4)
    };
    unit = unit.toLowerCase();

    if (!units.hasOwnProperty(unit)) {
        return undefined;
    }

    var factor = units[unit];
    return number * factor;
}

function formatDuration(seconds) {
    if (!seconds) return "-";
    if (seconds < 1) return "00:00:00";

    var s = seconds % 60;
    var m = (seconds % 3600) / 60;
    var h = seconds / 3600;

    return _.sprintf(gettext(/* L10N: duration format */ "%(hour)02d:%(minute)02d:%(second)02d"), {hour: h, minute: m, second: s});
}

function formatFuzzyEstimation(seconds, base) {
    if (!seconds || seconds < 1) return "-";

    var m;
    if (base != undefined) {
        m = moment(base);
    } else {
        m = moment();
    }

    m.add(seconds, "s");
    return m.fromNow(true);
}

function formatFuzzyPrintTime(totalSeconds) {
    /**
     * Formats a print time estimate in a very fuzzy way.
     *
     * Accuracy decreases the higher the estimation is:
     *
     *   * less than 30s: "a few seconds"
     *   * 30s to a minute: "less than a minute"
     *   * 1 to 30min: rounded to full minutes, above 30s is minute + 1 ("27 minutes", "2 minutes")
     *   * 30min to 40min: "40 minutes"
     *   * 40min to 50min: "50 minutes"
     *   * 50min to 1h: "1 hour"
     *   * 1 to 12h: rounded to half hours, 15min to 45min is ".5", above that hour + 1 ("4 hours", "2.5 hours")
     *   * 12 to 24h: rounded to full hours, above 30min is hour + 1, over 23.5h is "1 day"
     *   * Over a day: rounded to half days, 8h to 16h is ".5", above that days + 1 ("1 day", "4 days", "2.5 days")
     */

    if (!totalSeconds || totalSeconds < 1) return "-";

    var d = moment.duration(totalSeconds, "seconds");

    var seconds = d.seconds();
    var minutes = d.minutes();
    var hours = d.hours();
    var days = d.days();

    var replacements = {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        totalSeconds: totalSeconds
    };

    var text = "-";

    if (days >= 1) {
        // days
        if (hours >= 16) {
            replacements.days += 1;

            if (replacements.days === 1) {
                text = gettext("%(days)d day");
            } else {
                text = gettext("%(days)d days");
            }
        } else if (hours >= 8 && hours < 16) {
            text = gettext("%(days)d.5 days");
        } else {
            if (days === 1) {
                text = gettext("%(days)d day");
            } else {
                text = gettext("%(days)d days");
            }
        }
    } else if (hours >= 1) {
        // only hours
        if (hours < 12) {
            if (minutes < 15) {
                // less than .15 => .0
                if (hours === 1) {
                    text = gettext("%(hours)d hour");
                } else {
                    text = gettext("%(hours)d hours");
                }
            } else if (minutes >= 15 && minutes < 45) {
                // between .25 and .75 => .5
                text = gettext("%(hours)d.5 hours");
            } else {
                // over .75 => hours + 1
                replacements.hours += 1;

                if (replacements.hours === 1) {
                    text = gettext("%(hours)d hour");
                } else {
                    text = gettext("%(hours)d hours");
                }
            }
        } else {
            if (hours === 23 && minutes > 30) {
                // over 23.5 hours => 1 day
                text = gettext("1 day");
            } else {
                if (minutes > 30) {
                    // over .5 => hours + 1
                    replacements.hours += 1;
                }
                text = gettext("%(hours)d hours");
            }
        }
    } else if (minutes >= 1) {
        // only minutes
        if (minutes < 2) {
            if (seconds < 30) {
                text = gettext("a minute");
            } else {
                text = gettext("2 minutes");
            }
        } else if (minutes < 30) {
            if (seconds > 30) {
                replacements.minutes += 1;
            }
            text = gettext("%(minutes)d minutes");
        } else if (minutes <= 40) {
            text = gettext("40 minutes");
        } else if (minutes <= 50) {
            text = gettext("50 minutes");
        } else {
            text = gettext("1 hour");
        }
    } else {
        // only seconds
        if (seconds < 30) {
            text = gettext("a few seconds");
        } else {
            text = gettext("less than a minute");
        }
    }

    return _.sprintf(text, replacements);
}

function formatDate(unixTimestamp) {
    if (!unixTimestamp) return "-";
    return moment.unix(unixTimestamp).format(gettext(/* L10N: Date format */ "YYYY-MM-DD HH:mm"));
}

function formatTimeAgo(unixTimestamp) {
    if (!unixTimestamp) return "-";
    return moment.unix(unixTimestamp).fromNow();
}

function formatFilament(filament) {
    if (!filament || !filament["length"]) return "-";
    var result = "%(length).02fm";
    if (filament.hasOwnProperty("volume") && filament.volume) {
        result += " / " + "%(volume).02fcm³";
    }
    return _.sprintf(result, {length: filament["length"] / 1000, volume: filament["volume"]});
}

function cleanTemperature(temp) {
    if (temp === undefined || !_.isNumber(temp)) return "-";
    if (temp < 10) return gettext("off");
    return temp;
}

function formatTemperature(temp, showF) {
    if (temp === undefined || !_.isNumber(temp)) return "-";
    if (temp < 10) return gettext("off");
    if (showF) {
        return _.sprintf("%.1f&deg;C (%.1f&deg;F)", temp, temp * 9 / 5 + 32);
    } else {
        return _.sprintf("%.1f&deg;C", temp);
    }
}

function pnotifyAdditionalInfo(inner) {
    return '<div class="pnotify_additional_info">'
        + '<div class="pnotify_more"><a href="#" onclick="$(this).children().toggleClass(\'icon-caret-right icon-caret-down\').parent().parent().next().slideToggle(\'fast\')">More <i class="icon-caret-right"></i></a></div>'
        + '<div class="pnotify_more_container hide">' + inner + '</div>'
        + '</div>';
}

function ping(url, callback) {
    var img = new Image();
    var calledBack = false;

    img.onload = function() {
        callback(true);
        calledBack = true;
    };
    img.onerror = function() {
        if (!calledBack) {
            callback(true);
            calledBack = true;
        }
    };
    img.src = url;
    setTimeout(function() {
        if (!calledBack) {
            callback(false);
            calledBack = true;
        }
    }, 1500);
}

function showOfflineOverlay(title, message, reconnectCallback) {
    if (title == undefined) {
        title = gettext("Server is offline");
    }

    $("#offline_overlay_title").text(title);
    $("#offline_overlay_message").html(message);
    $("#offline_overlay_reconnect").click(reconnectCallback);
    if (!$("#offline_overlay").is(":visible"))
        $("#offline_overlay").show();
}

function hideOfflineOverlay() {
    $("#offline_overlay").hide();
}

function showMessageDialog(msg, options) {
    options = options || {};
    if (_.isPlainObject(msg)) {
        options = msg;
    } else {
        options.message = msg;
    }

    var title = options.title || "";
    var message = options.message || "";
    var close = options.close || gettext("Close");
    var onclose = options.onclose || undefined;
    var onshow = options.onshow || undefined;
    var onshown = options.onshown || undefined;
    var nofade = options.nofade || false;

    if (_.isString(message)) {
        message = $("<p>" + message + "</p>");
    }

    var modalHeader = $('<a href="javascript:void(0)" class="close" data-dismiss="modal" aria-hidden="true">&times;</a><h3>' + title + '</h3>');
    var modalBody = $(message);
    var modalFooter = $('<a href="javascript:void(0)" class="btn" data-dismiss="modal" aria-hidden="true">' + close + '</a>');

    var modal = $('<div></div>')
        .addClass("modal hide");
    if (!nofade) {
        modal.addClass("fade");
    }
    modal
        .append($('<div></div>').addClass('modal-header').append(modalHeader))
        .append($('<div></div>').addClass('modal-body').append(modalBody))
        .append($('<div></div>').addClass('modal-footer').append(modalFooter));

    modal.on("hidden", function() {
        if (onclose && _.isFunction(onclose)) {
            onclose();
        }
    });

    if (onshow) {
        modal.on("show", onshow);
    }

    if (onshown) {
        modal.on("shown", onshown);
    }

    modal.modal("show");
    return modal;
}

function showConfirmationDialog(msg, onacknowledge, options) {
    options = options || {};
    if (_.isPlainObject(msg)) {
        options = msg;
    } else {
        options.message = msg;
        options.onproceed = onacknowledge;
    }

    var title = options.title || gettext("Are you sure?");

    var message = options.message || "";
    var question = options.question || gettext("Are you sure you want to proceed?");

    var html = options.html;

    var cancel = options.cancel || gettext("Cancel");
    var proceed = options.proceed || gettext("Proceed");
    var proceedClass = options.proceedClass || "danger";
    var onproceed = options.onproceed || undefined;
    var oncancel = options.oncancel || undefined;
    var onclose = options.onclose || undefined;
    var dialogClass = options.dialogClass || "";
    var nofade = options.nofade || false;
    var noclose = options.noclose || false;

    var modalHeader;
    if (noclose) {
        modalHeader = $('<h3>' + title + '</h3>');
    } else {
        modalHeader = $('<a href="javascript:void(0)" class="close" data-dismiss="modal" aria-hidden="true">&times;</a><h3>' + title + '</h3>');
    }

    var modalBody;
    if (html) {
        modalBody = $(html);
    } else {
        modalBody = $('<p>' + message + '</p><p>' + question + '</p>');
    }

    var cancelButton = $('<a href="javascript:void(0)" class="btn">' + cancel + '</a>')
        .attr("data-dismiss", "modal")
        .attr("aria-hidden", "true");
    var proceedButton = $('<a href="javascript:void(0)" class="btn">' + proceed + '</a>')
        .addClass("btn-" + proceedClass);

    var modal = $('<div></div>')
        .addClass('modal hide');
    if (!nofade) {
        modal.addClass('fade');
    }
    modal.addClass(dialogClass)
        .append($('<div></div>').addClass('modal-header').append(modalHeader))
        .append($('<div></div>').addClass('modal-body').append(modalBody))
        .append($('<div></div>').addClass('modal-footer').append(cancelButton).append(proceedButton));
    modal.on('hidden', function(event) {
        if (onclose && _.isFunction(onclose)) {
            onclose(event);
        }
    });

    var modalOptions = {};
    if (noclose) {
        modalOptions.backdrop = "static";
        modalOptions.keyboard = false;
    }
    modal.modal(modalOptions);

    proceedButton.click(function(e) {
        e.preventDefault();
        if (onproceed && _.isFunction(onproceed)) {
            onproceed(e);
        }
        modal.modal("hide");
    });
    cancelButton.click(function(e) {
        if (oncancel && _.isFunction(oncancel)) {
            oncancel(e);
        }
    });

    return modal;
}

function showSelectionDialog(options) {
    var title = options.title;
    var message = options.message || undefined;
    var selections = options.selections || [];

    var maycancel = options.maycancel || false;
    var cancel = options.cancel || undefined;
    var onselect = options.onselect || undefined;
    var onclose = options.onclose || undefined;
    var dialogClass = options.dialogClass || "";
    var nofade = options.nofade || false;

    // header
    var modalHeader;
    if (maycancel) {
        modalHeader = $('<a href="javascript:void(0)" class="close" data-dismiss="modal" aria-hidden="true">&times;</a><h3>' + title + '</h3>');
    } else {
        modalHeader = $('<h3>' + title + '</h3>');
    }

    // body
    var buttons = [];
    var selectionBody = $("<div></div>");
    var container;
    var additionalClass;

    if (selections.length === 1) {
        container = selectionBody;
        additionalClass = "btn-block";
    } else if (selections.length === 2) {
        container = $("<div class='row-fluid'></div>");
        selectionBody.append(container);
        additionalClass = "span6"
    } else {
        container = $("<div class='row-fluid'></div>");
        selectionBody.append(container);
        additionalClass = "span6 offset3";
    }

    _.each(selections, function(s, i) {
        var button = $('<button class="btn" data-index="' + i + '">' + selections[i] + '</button>');
        if (additionalClass) {
            button.addClass(additionalClass);
        }
        container.append(button);
        buttons.push(button);

        if (selections.length > 2 && i < selections.length - 1) {
            container = $("<div class='row-fluid'></div>");
            selectionBody.append(container);
        }
    });

    // divs
    var headerDiv = $('<div></div>').addClass('modal-header').append(modalHeader);

    var bodyDiv = $('<div></div>').addClass('modal-body');
    if (message) {
        bodyDiv.append($('<p>' + message + '</p>'));
    }
    bodyDiv.append(selectionBody);

    // create modal and do final wiring up
    var modal = $('<div></div>')
        .addClass('modal hide');
    if (!nofade) {
        modal.addClass('fade');
    }
    if (!cancel) {
        modal.data("backdrop", "static").data("keyboard", "false");
    }

    modal.addClass(dialogClass)
        .append(headerDiv)
        .append(bodyDiv);
    modal.on('hidden', function(event) {
        if (onclose && _.isFunction(onclose)) {
            onclose(event);
        }
    });
    modal.modal("show");

    _.each(buttons, function(button) {
        button.click(function(e) {
            e.preventDefault();
            var index = button.data("index");
            if (index < 0) {
                return;
            }

            if (onselect && _.isFunction(onselect)) {
                onselect(index, e);
            }
            modal.modal("hide");
        })
    });

    return modal;
}

/**
 * Shows a progress modal depending on a supplied promise.
 *
 * Will listen to the supplied promise, update the progress on .progress events and
 * enabling the close button and (optionally) closing the dialog on promise resolve.
 *
 * The calling code should call "notify" on the deferred backing the promise and supply:
 *
 *   * the text to display on the progress bar and the optional output field and
 *     a boolean value indicating whether the operation behind that update was successful or not
 *   * a short text to display on the progress bar, a long text to display on the optional output
 *     field and a boolean value indicating whether the operation behind that update was
 *     successful or not
 *
 * Non-successful progress updates will remove the barClassSuccess class from the progress bar and
 * apply the barClassFailure class and also apply the outputClassFailure to the produced line
 * in the output.
 *
 * To determine the progress, calling code should supply the prognosed maximum number of
 * progress events. An internal counter will increment on each progress event and used together
 * with the max value to calculate the percentage to display on the progress bar.
 *
 * If no max value is set, the progress bar will show a striped animation at 100% fill status
 * to visualize "unknown but ongoing" status.
 *
 * Available options:
 *
 *   * title: the title of the modal, defaults to "Progress"
 *   * message: the message of the modal, defaults to ""
 *   * buttonText: the text on the close button, defaults to "Close"
 *   * max: maximum number of expected progress events (when 100% will be reached), defaults
 *     to undefined
 *   * close: whether to close the dialog on completion, defaults to false
 *   * output: whether to display the progress texts in an output field, defaults to false
 *   * dialogClass: additional class to apply to the dialog div
 *   * barClassSuccess: additional class for the progress bar while all progress events are
 *     successful
 *   * barClassFailure: additional class for the progress bar when a progress event was
 *     unsuccessful
 *   * outputClassSuccess: additional class for successful output lines
 *   * outputClassFailure: additional class for unsuccessful output lines
 *
 * @param options modal options
 * @param promise promise to monitor
 * @returns {*|jQuery} the modal object
 */
function showProgressModal(options, promise) {
    var title = options.title || gettext("Progress");
    var message = options.message || "";
    var buttonText = options.button || gettext("Close");
    var max = options.max || undefined;
    var close = options.close || false;
    var output = options.output || false;

    var dialogClass = options.dialogClass || "";
    var barClassSuccess = options.barClassSuccess || "";
    var barClassFailure = options.barClassFailure || "bar-danger";
    var outputClassSuccess = options.outputClassSuccess || "";
    var outputClassFailure = options.outputClassFailure || "text-error";

    var modalHeader = $('<h3>' + title + '</h3>');
    var paragraph = $('<p>' + message + '</p>');

    var progress = $('<div class="progress progress-text-centered"></div>');
    var progressBar = $('<div class="bar"></div>')
        .addClass(barClassSuccess);
    var progressTextBack = $('<span class="progress-text-back"></span>');
    var progressTextFront = $('<span class="progress-text-front"></span>')
        .width(progress.width());

    if (max == undefined) {
        progress.addClass("progress-striped active");
        progressBar.width("100%");
    }

    progressBar
        .append(progressTextFront);
    progress
        .append(progressTextBack)
        .append(progressBar);

    var button = $('<button class="btn">' + buttonText + '</button>')
        .prop("disabled", true)
        .attr("data-dismiss", "modal")
        .attr("aria-hidden", "true");

    var modalBody = $('<div></div>')
        .addClass('modal-body')
        .append(paragraph)
        .append(progress);

    var pre;
    if (output) {
        pre = $("<pre class='pre-scrollable pre-output' style='height: 70px; font-size: 0.8em'></pre>");
        modalBody.append(pre);
    }

    var modal = $('<div></div>')
        .addClass('modal hide fade')
        .addClass(dialogClass)
        .append($('<div></div>').addClass('modal-header').append(modalHeader))
        .append(modalBody)
        .append($('<div></div>').addClass('modal-footer').append(button));
    modal.modal({keyboard: false, backdrop: "static", show: true});

    var counter = 0;
    promise
        .progress(function() {
            var short, long, success;
            if (arguments.length === 2) {
                short = long = arguments[0];
                success = arguments[1];
            } else if (arguments.length === 3) {
                short = arguments[0];
                long = arguments[1];
                success = arguments[2];
            } else {
                throw Error("Invalid parameters for showProgressModal, expected either (text, success) or (short, long, success)");
            }

            var value;

            if (max === undefined || max <= 0) {
                value = 100;
            } else {
                counter++;
                value = Math.max(Math.min(counter * 100 / max, 100), 0);
            }

            // update progress bar
            progressBar.width(String(value) + "%");
            progressTextFront.text(short);
            progressTextBack.text(short);
            progressTextFront.width(progress.width());

            // if not successful, apply failure class
            if (!success && !progressBar.hasClass(barClassFailure)) {
                progressBar
                    .removeClass(barClassSuccess)
                    .addClass(barClassFailure);
            }

            if (output && pre) {
                if (success) {
                    pre.append($("<span class='" + outputClassSuccess + "'>" + long + "</span>"));
                } else {
                    pre.append($("<span class='" + outputClassFailure + "'>" + long + "</span>"));
                }
                pre.scrollTop(pre[0].scrollHeight - pre.height());
            }
        })
        .done(function() {
            button.prop("disabled", false);
            if (close) {
                modal.modal("hide");
            }
        })
        .fail(function() {
            button.prop("disabled", false);
        });

    return modal;
}

function showReloadOverlay() {
    $("#reloadui_overlay").show();
}

function wrapPromiseWithAlways(p) {
    var deferred = $.Deferred();
    p.always(function() { deferred.resolve.apply(deferred, arguments); });
    return deferred.promise();
}

function commentableLinesToArray(lines) {
    return splitTextToArray(lines, "\n", true, function(item) {return !_.startsWith(item, "#")});
}

function splitTextToArray(text, sep, stripEmpty, filter) {
    return _.filter(
        _.map(
            text.split(sep),
            function(item) { return (item) ? item.trim() : ""; }
        ),
        function(item) { return (stripEmpty ? item : true) && (filter ? filter(item) : true); }
    );
}

/**
 * Returns true if comparing data and oldData yields changes, false otherwise.
 *
 * E.g.
 *
 *   hasDataChanged(
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "three", key: "value"}},
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "3", four: "4"}}
 *   )
 *
 * will return
 *
 *   true
 *
 * and
 *
 *   hasDataChanged(
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "3"}},
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "3"}}
 *   )
 *
 * will return
 *
 *   false
 *
 * Note that this will assume data and oldData to be structurally identical (same keys)
 * and is optimized to check for value changes, not key updates.
 */
function hasDataChanged(data, oldData) {
    // noinspection EqualityComparisonWithCoercionJS
    if (data == oldData && data == undefined) {
        return false;
    }

    if (_.isPlainObject(data) && _.isPlainObject(oldData)) {
        return _.any(_.keys(data), function(key) {return hasDataChanged(data[key], oldData[key]);});
    } else {
        return !_.isEqual(data, oldData);
    }
}

/**
 * Compare provided data and oldData plain objects and only return those
 * substructures of data that actually changed.
 *
 * E.g.
 *
 *   getOnlyChangedData(
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "three"}},
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "3"}}
 *   )
 *
 * will return
 *
 *   {fnord: {three: "three"}}
 *
 * and
 *
 *   getOnlyChangedData(
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "3"}},
 *     {foo: "bar", fnord: {one: "1", two: "2", three: "3"}}
 *   )
 *
 * will return
 *
 *   {}
 *
 * Note that this will assume data and oldData to be structurally identical (same keys)
 * and is optimized to check for value changes, not key updates.
 */
function getOnlyChangedData(data, oldData) {
    // noinspection EqualityComparisonWithCoercionJS
    if (data == undefined) {
        return {};
    }

    // noinspection EqualityComparisonWithCoercionJS
    if (oldData == undefined) {
        return data;
    }

    var f = function(root, oldRoot) {
        if (!_.isPlainObject(root)) {
            return root;
        }

        var retval = {};
        _.forOwn(root, function(value, key) {
            var oldValue = undefined;
            // noinspection EqualityComparisonWithCoercionJS
            if (oldRoot != undefined && oldRoot.hasOwnProperty(key)) {
                oldValue = oldRoot[key];
            }
            if (_.isPlainObject(value)) {
                // noinspection EqualityComparisonWithCoercionJS
                if (oldValue == undefined) {
                    retval[key] = value;
                } else if (hasDataChanged(value, oldValue)) {
                    retval[key] = f(value, oldValue);
                }
            } else {
                // noinspection EqualityComparisonWithCoercionJS
                if (!(value == oldValue && value == undefined) && !_.isEqual(value, oldValue)) {
                    retval[key] = value;
                }
            }
        });
        return retval;
    };

    return f(data, oldData);
}

function setOnViewModels(allViewModels, key, value) {
    setOnViewModelsIf(allViewModels, key, value, undefined);
}

function setOnViewModelsIf(allViewModels, key, value, condition) {
    if (!allViewModels) return;
    _.each(allViewModels, function(viewModel) {
        setOnViewModelIf(viewModel, key, value, condition);
    })
}

function setOnViewModel(viewModel, key, value) {
    setOnViewModelIf(viewModel, key, value, undefined);
}

function setOnViewModelIf(viewModel, key, value, condition) {
    if (condition === undefined || !_.isFunction(condition)) {
        condition = function() { return true; };
    }

    try {
        if (!condition(viewModel)) {
            return;
        }

        viewModel[key] = value;
    } catch (exc) {
        log.error("Error while setting", key, "to", value, "on view model", viewModel.constructor.name, ":", (exc.stack || exc));
    }
}

function callViewModels(allViewModels, method, callback) {
    callViewModelsIf(allViewModels, method, undefined, callback);
}

function callViewModelsIf(allViewModels, method, condition, callback) {
    if (!allViewModels) return;

    _.each(allViewModels, function(viewModel) {
        try {
            callViewModelIf(viewModel, method, condition, callback);
        } catch (exc) {
            log.error("Error calling", method, "on view model", viewModel.constructor.name, ":", (exc.stack || exc));
        }
    });
}

function callViewModel(viewModel, method, callback, raiseErrors) {
    callViewModelIf(viewModel, method, undefined, callback, raiseErrors);
}

function callViewModelIf(viewModel, method, condition, callback, raiseErrors) {
    raiseErrors = raiseErrors === true || false;

    if (condition === undefined || !_.isFunction(condition)) {
        condition = function() { return true; };
    }

    if (!_.isFunction(viewModel[method]) || !condition(viewModel, method)) return;

    var parameters = undefined;
    if (!_.isFunction(callback)) {
        // if callback is not a function that means we are supposed to directly
        // call the view model method instead of providing it to the callback
        // - let's figure out how

        if (callback === undefined) {
            // directly call view model method with no parameters
            parameters = undefined;
            log.trace("Calling method", method, "on view model");
        } else if (_.isArray(callback)) {
            // directly call view model method with these parameters
            parameters = callback;
            log.trace("Calling method", method, "on view model with specified parameters", parameters);
        } else {
            // ok, this doesn't make sense, callback is neither undefined nor
            // an array, we'll return without doing anything
            return;
        }

        // we reset this here so we now further down that we want to call
        // the method directly
        callback = undefined;
    } else {
        log.trace("Providing method", method, "on view model to specified callback", callback);
    }

    try {
        if (callback === undefined) {
            if (parameters !== undefined) {
                // call the method with the provided parameters
                viewModel[method].apply(viewModel, parameters);
            } else {
                // call the method without parameters
                viewModel[method]();
            }
        } else {
            // provide the method to the callback
            callback(viewModel[method], viewModel);
        }
    } catch (exc) {
        if (raiseErrors) {
            throw exc;
        } else {
            log.error("Error calling", method, "on view model", viewModel.constructor.name, ":", (exc.stack || exc));
        }
    }
}

var sizeObservable = function(observable) {
    return ko.computed({
        read: function() {
            return formatSize(observable());
        },
        write: function(value) {
            var result = bytesFromSize(value);
            if (result != undefined) {
                observable(result);
            }
        }
    })
};

var getQueryParameterByName = function(name, url) {
    // from http://stackoverflow.com/a/901144/2028598
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * Escapes unprintable ASCII characters in the provided string.
 *
 * E.g. turns a null byte in the string into "\x00".
 *
 * Characters 0 to 31 excluding 9, 10 and 13 will be escaped, as will
 * 127 and 255. That should leave printable characters and unicode
 * alone.
 *
 * Originally based on
 * https://gist.github.com/mathiasbynens/1243213#gistcomment-53590
 *
 * @param str The string to escape
 * @returns {string}
 */
var escapeUnprintableCharacters = function(str) {
    var result = "";
    var index = 0;
    var charCode;

    while (!isNaN(charCode = str.charCodeAt(index))) {
        if ((charCode < 32 && charCode != 9 && charCode != 10 && charCode != 13) || charCode == 127 || charCode == 255) {
            // special hex chars
            result += "\\x" + (charCode > 15 ? "" : "0") + charCode.toString(16)
        } else {
            // anything else
            result += str[index];
        }

        index++;
    }
    return result;
};

var copyToClipboard = function(text) {
    var temp = $("<textarea>");
    $("body").append(temp);
    temp.val(text).select();
    document.execCommand("copy");
    temp.remove();
};

;

// source: js/app/main.js
$(function() {
        OctoPrint = window.OctoPrint;

        //~~ Lodash setup

        _.mixin({"sprintf": sprintf, "vsprintf": vsprintf});

        //~~ Logging setup

        log.setLevel(CONFIG_DEBUG ? log.levels.DEBUG : log.levels.INFO);

        //~~ OctoPrint client setup
        OctoPrint.options.baseurl = BASEURL;
        OctoPrint.options.apikey = UI_API_KEY;

        var l10n = getQueryParameterByName("l10n");
        if (l10n) {
            OctoPrint.options.locale = l10n;
        }

        OctoPrint.socket.onMessage("connected", function(data) {
            var payload = data.data;
            OctoPrint.options.apikey = payload.apikey;

            // update the API key directly in jquery's ajax options too,
            // to ensure the fileupload plugin and any plugins still using
            // $.ajax directly still work fine too
            UI_API_KEY = payload["apikey"];
            $.ajaxSetup({
                headers: {"X-Api-Key": UI_API_KEY}
            });
        });

        //~~ some CoreUI specific stuff we put into OctoPrint.coreui

        OctoPrint.coreui = (function() {
            var exports = {
                browserTabVisibility: undefined,
                selectedTab: undefined,
                settingsOpen: false,
                wizardOpen: false,
                browser: {
                    chrome: false,
                    firefox: false,
                    safari: false,
                    ie: false,
                    edge: false,
                    opera: false,

                    mobile: false,
                    desktop: false
                },
                viewmodels: {}
            };

            var browserVisibilityCallbacks = [];

            var getHiddenProp = function() {
                var prefixes = ["webkit", "moz", "ms", "o"];

                // if "hidden" is natively supported just return it
                if ("hidden" in document) {
                    return "hidden"
                }

                // otherwise loop over all the known prefixes until we find one
                var vendorPrefix = _.find(prefixes, function(prefix) {
                    return (prefix + "Hidden" in document);
                });
                if (vendorPrefix !== undefined) {
                    return vendorPrefix + "Hidden";
                }

                // nothing found
                return undefined;
            };

            var isHidden = function() {
                var prop = getHiddenProp();
                if (!prop) return false;

                return document[prop];
            };

            var updateBrowserVisibility = function() {
                var visible = !isHidden();
                exports.browserTabVisible = visible;
                _.each(browserVisibilityCallbacks, function(callback) {
                    callback(visible);
                })
            };

            // register for browser visibility tracking

            var prop = getHiddenProp();
            if (prop) {
                var eventName = prop.replace(/[H|h]idden/, "") + "visibilitychange";
                document.addEventListener(eventName, updateBrowserVisibility);

                updateBrowserVisibility();
            }

            // determine browser - loosely based on is.js

            var navigator = window.navigator;
            var userAgent = (navigator && navigator.userAgent || "").toLowerCase();
            var vendor = (navigator && navigator.vendor || "").toLowerCase();

            exports.browser.opera = userAgent.match(/opera|opr/) !== null;
            exports.browser.chrome = !exports.browser.opera && /google inc/.test(vendor) && userAgent.match(/chrome|crios/) !== null;
            exports.browser.firefox = userAgent.match(/firefox|fxios/) !== null;
            exports.browser.ie = userAgent.match(/msie|trident/) !== null;
            exports.browser.edge = userAgent.match(/edge/) !== null;
            exports.browser.safari = !exports.browser.chrome && !exports.browser.edge && !exports.browser.opera && userAgent.match(/safari/) !== null;

            exports.browser.mobile = $.browser.mobile;
            exports.browser.desktop = !exports.browser.mobile;

            // exports

            exports.isVisible = function() { return !isHidden() };
            exports.onBrowserVisibilityChange = function(callback) {
                browserVisibilityCallbacks.push(callback);
            };

            return exports;
        })();

        log.debug("Browser environment:", OctoPrint.coreui.browser);

        //~~ AJAX setup

        // work around a stupid iOS6 bug where ajax requests get cached and only work once, as described at
        // http://stackoverflow.com/questions/12506897/is-safari-on-ios-6-caching-ajax-results
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            if (options.type !== "GET") {
                if (options.hasOwnProperty("headers")) {
                    options.headers["Cache-Control"] = "no-cache";
                } else {
                    options.headers = { "Cache-Control": "no-cache" };
                }
            }
        });

        // send the current UI API key with any request
        $.ajaxSetup({
            headers: {"X-Api-Key": UI_API_KEY}
        });

        //~~ Initialize file upload plugin

        $.widget("blueimp.fileupload", $.blueimp.fileupload, {
            options: {
                dropZone: null,
                pasteZone: null
            }
        });

        //~~ Initialize i18n

        var catalog = window["BABEL_TO_LOAD_" + LOCALE];
        if (catalog === undefined) {
            catalog = {messages: undefined, plural_expr: undefined, locale: undefined, domain: undefined}
        }
        babel.Translations.load(catalog).install();

        moment.locale(LOCALE);

        // Dummy translation requests for dynamic strings supplied by the backend
        var dummyTranslations = [
            // printer states
            gettext("Offline"),
            gettext("Opening serial port"),
            gettext("Detecting serial port"),
            gettext("Detecting baudrate"),
            gettext("Connecting"),
            gettext("Operational"),
            gettext("Printing from SD"),
            gettext("Sending file to SD"),
            gettext("Printing"),
            gettext("Paused"),
            gettext("Closed"),
            gettext("Transferring file to SD")
        ];

        //~~ Initialize PNotify

        PNotify.prototype.options.styling = "bootstrap2";
        PNotify.prototype.options.mouse_reset = false;
        PNotify.prototype.options.stack.firstpos1 = 40 + 20; // navbar + 20
        PNotify.prototype.options.stack.firstpos2 = 20;
        PNotify.prototype.options.stack.spacing1 = 20;
        PNotify.prototype.options.stack.spacing2 = 20;
        PNotify.prototype.options.delay = 5000;
        PNotify.prototype.options.animate_speed = "fast";

        PNotify.singleButtonNotify = function(options) {
            if (!options.confirm || !options.confirm.buttons || !options.confirm.buttons.length) {
                return new PNotify(options);
            }

            var autoDisplay = options.auto_display !== false;

            var params = $.extend(true, {}, options);
            params.auto_display = false;

            var notify = new PNotify(params);
            notify.options.confirm.buttons = [notify.options.confirm.buttons[0]];
            notify.modules.confirm.makeDialog(notify, notify.options.confirm);

            if (autoDisplay) {
                notify.open();
            }
            return notify;
        };

        //~~ Initialize view models

        // the view model map is our basic look up table for dependencies that may be injected into other view models
        var viewModelMap = {};

        // Fix Function#name on browsers that do not support it (IE):
        // see: http://stackoverflow.com/questions/6903762/function-name-not-supported-in-ie
        if (!(function f() {}).name) {
            Object.defineProperty(Function.prototype, 'name', {
                get: function() {
                    return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
                }
            });
        }

        // helper to create a view model instance with injected constructor parameters from the view model map
        var _createViewModelInstance = function(viewModel, viewModelMap, optionalDependencyPass) {

            // mirror the requested dependencies with an array of the viewModels
            var viewModelParametersMap = function(parameter) {
                // check if parameter is found within optional array and if all conditions are met return null instead of undefined
                if (optionalDependencyPass && viewModel.optional.indexOf(parameter) !== -1 && !viewModelMap[parameter]) {
                    log.debug("Resolving optional parameter", [parameter], "without viewmodel");
                    return null; // null == "optional but not available"
                }

                return viewModelMap[parameter] || undefined; // undefined == "not available"
            };

            // try to resolve all of the view model's constructor parameters via our view model map
            var constructorParameters = _.map(viewModel.dependencies, viewModelParametersMap) || [];

            if (constructorParameters.indexOf(undefined) !== -1) {
                log.debug("Postponing", viewModel.name, "due to missing parameters:", _.keys(_.pick(_.object(viewModel.dependencies, constructorParameters), _.isUndefined)));
                return;
            }

            // transform array into object if a plugin wants it as an object
            constructorParameters = (viewModel.returnObject) ? _.object(viewModel.dependencies, constructorParameters) : constructorParameters;

            // if we came this far then we could resolve all constructor parameters, so let's construct that view model
            log.debug("Constructing", viewModel.name, "with parameters:", viewModel.dependencies);
            return new viewModel.construct(constructorParameters);
        };

        // map any additional view model bindings we might need to make
        var additionalBindings = {};
        _.each(OCTOPRINT_ADDITIONAL_BINDINGS, function(bindings) {
            var viewModelId = bindings[0];
            var viewModelBindTargets = bindings[1];
            if (!_.isArray(viewModelBindTargets)) {
                viewModelBindTargets = [viewModelBindTargets];
            }

            if (!additionalBindings.hasOwnProperty(viewModelId)) {
                additionalBindings[viewModelId] = viewModelBindTargets;
            } else {
                additionalBindings[viewModelId] = additionalBindings[viewModelId].concat(viewModelBindTargets);
            }
        });

        // helper for translating the name of a view model class into an identifier for the view model map
        var _getViewModelId = function(name){
            return name.substr(0, 1).toLowerCase() + name.substr(1); // FooBarViewModel => fooBarViewModel
        };

        // instantiation loop, will make multiple passes over the list of unprocessed view models until all
        // view models have been successfully instantiated with all of their dependencies or no changes can be made
        // any more which means not all view models can be instantiated due to missing dependencies
        var unprocessedViewModels = OCTOPRINT_VIEWMODELS.slice();
        unprocessedViewModels = unprocessedViewModels.concat(ADDITIONAL_VIEWMODELS);

        var allViewModels = [];
        var allViewModelData = [];
        var pass = 1;
        var optionalDependencyPass = false;
        log.info("Starting dependency resolution...");
        while (unprocessedViewModels.length > 0) {
            log.debug("Dependency resolution, pass #" + pass);
            var startLength = unprocessedViewModels.length;
            var postponed = [];

            // now try to instantiate every one of our as of yet unprocessed view model descriptors
            while (unprocessedViewModels.length > 0){
                var viewModel = unprocessedViewModels.shift();

                // wrap anything not object related into an object
                if(!_.isPlainObject(viewModel)) {
                    viewModel = {
                        construct: (_.isArray(viewModel)) ? viewModel[0] : viewModel,
                        dependencies: viewModel[1] || [],
                        elements: viewModel[2] || [],
                        optional: viewModel[3] || []
                    };
                }

                // make sure we have atleast a function
                if (!_.isFunction(viewModel.construct)) {
                    log.error("No function to instantiate with", viewModel);
                    continue;
                }

                // if name is not set, get name from constructor, if it's an anonymous function generate one
                viewModel.name = viewModel.name || _getViewModelId(viewModel.construct.name) || _.uniqueId("unnamedViewModel");

                // no alternative names? empty array
                viewModel.additionalNames = viewModel.additionalNames || [];

                // make sure all value's are set and in an array
                _.each(["dependencies", "elements", "optional", "additionalNames"], function(key) {
                    if (viewModel[key] === undefined) {
                        viewModel[key] = [];
                    } else {
                        viewModel[key] = (_.isArray(viewModel[key])) ? viewModel[key] : [viewModel[key]];
                    }
                });

                // make sure that we don't have two view models going by the same name
                if (_.has(viewModelMap, viewModel.name)) {
                    log.error("Duplicate name while instantiating " + viewModel.name);
                    continue;
                }

                var viewModelInstance;
                try {
                    viewModelInstance = _createViewModelInstance(viewModel, viewModelMap, optionalDependencyPass);
                } catch (exc) {
                    log.error("Error instantiating", viewModel.name, ":", (exc.stack || exc));
                    continue;
                }

                // our view model couldn't yet be instantiated, so postpone it for a bit
                if (viewModelInstance === undefined) {
                    postponed.push(viewModel);
                    continue;
                }

                // we could resolve the dependencies and the view model is not defined yet => add it, it's now fully processed
                var viewModelBindTargets = viewModel.elements;

                if (additionalBindings.hasOwnProperty(viewModel.name)) {
                    viewModelBindTargets = viewModelBindTargets.concat(additionalBindings[viewModel.name]);
                }

                allViewModelData.push([viewModelInstance, viewModelBindTargets]);
                allViewModels.push(viewModelInstance);
                viewModelMap[viewModel.name] = viewModelInstance;

                if (viewModel.additionalNames.length) {
                    var registeredAdditionalNames = [];
                    _.each(viewModel.additionalNames, function(additionalName) {
                        if (!_.has(viewModelMap, additionalName)) {
                            viewModelMap[additionalName] = viewModelInstance;
                            registeredAdditionalNames.push(additionalName);
                        }
                    });

                    if (registeredAdditionalNames.length) {
                        log.debug("Registered", viewModel.name, "under these additional names:", registeredAdditionalNames);
                    }
                }
            }

            // anything that's now in the postponed list has to be readded to the unprocessedViewModels
            unprocessedViewModels = unprocessedViewModels.concat(postponed);

            // if we still have the same amount of items in our list of unprocessed view models it means that we
            // couldn't instantiate any more view models over a whole iteration, which in turn mean we can't resolve the
            // dependencies of remaining ones, so log that as an error and then quit the loop
            if (unprocessedViewModels.length === startLength) {
                // I'm gonna let you finish but we will do another pass with the optional dependencies flag enabled
                if (!optionalDependencyPass) {
                    log.debug("Resolving next pass with optional dependencies flag enabled");
                    optionalDependencyPass = true;
                } else {
                    log.error("Could not instantiate the following view models due to unresolvable dependencies:");
                    _.each(unprocessedViewModels, function(entry) {
                        log.error(entry.name + " (missing: " + _.filter(entry.dependencies, function(id) { return !_.has(viewModelMap, id); }).join(", ") + " )");
                    });
                    break;
                }
            }

            log.debug("Dependency resolution pass #" + pass + " finished, " + unprocessedViewModels.length + " view models left to process");
            pass++;
        }
        log.info("... dependency resolution done");
        OctoPrint.coreui.viewmodels = viewModelMap;

        //~~ some additional hooks and initializations

        // make sure modals max out at the window height
        $.fn.modal.defaults.maxHeight = function(){
            // subtract the height of the modal header and footer
            return $(window).height() - 165;
        };

        // jquery plugin to select all text in an element
        // originally from: http://stackoverflow.com/a/987376
        $.fn.selectText = function() {
            var doc = document;
            var element = this[0];
            var range, selection;

            if (doc.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) {
                selection = window.getSelection();
                range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };

        $.fn.isChildOf = function (element) {
            return $(element).has(this).length > 0;
        };

        // from http://jsfiddle.net/KyleMit/X9tgY/
        $.fn.contextMenu = function (settings) {
            return this.each(function () {
                // Open context menu
                $(this).on("contextmenu", function (e) {
                    // return native menu if pressing control
                    if (e.ctrlKey) return;

                    $(settings.menuSelector)
                        .data("invokedOn", $(e.target))
                        .data("contextParent", $(this))
                        .show()
                        .css({
                            position: "fixed",
                            left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                            top: getMenuPosition(e.clientY, 'height', 'scrollTop'),
                            "z-index": 9999
                        }).off('click')
                        .on('click', function (e) {
                            if (e.target.tagName.toLowerCase() === "input")
                                return;

                            $(this).hide();

                            settings.menuSelected.call(this, $(this).data('invokedOn'), $(this).data('contextParent'), $(e.target));
                        });

                    return false;
                });

                //make sure menu closes on any click
                $(document).click(function () {
                    $(settings.menuSelector).hide();
                });
            });

            function getMenuPosition(mouse, direction, scrollDir) {
                var win = $(window)[direction](),
                    scroll = $(window)[scrollDir](),
                    menu = $(settings.menuSelector)[direction](),
                    position = mouse + scroll;

                // opening menu would pass the side of the page
                if (mouse + menu > win && menu < mouse)
                    position -= menu;

                return position;
            }
        };

        $.fn.lazyload = function() {
            return this.each(function() {
                if (this.tagName.toLowerCase() !== "img") return;

                var src = this.getAttribute("data-src");
                if (src) {
                    this.setAttribute("src", src);
                    this.removeAttribute("data-src");
                }
            });
        };

        // Use bootstrap tabdrop for tabs and pills
        $('.nav-pills, .nav-tabs').tabdrop();

        // Allow components to react to tab change
        var onTabChange = function(current, previous) {
            log.debug("Selected OctoPrint tab changed: previous = " + previous + ", current = " + current);
            OctoPrint.coreui.selectedTab = current;
            callViewModels(allViewModels, "onTabChange", [current, previous]);
        };

        var onAfterTabChange = function(current, previous) {
            callViewModels(allViewModels, "onAfterTabChange", [current, previous]);
        };

        var tabs = $('#tabs').find('a[data-toggle="tab"]');
        tabs.on('show', function (e) {
            var current = e.target.hash;
            var previous = e.relatedTarget.hash;
            onTabChange(current, previous);
        });

        tabs.on('shown', function (e) {
            var current = e.target.hash;
            var previous = e.relatedTarget.hash;
            onAfterTabChange(current, previous);

            // make sure we also update the hash but stick to the current scroll position
            var scrollmem = $('body').scrollTop() || $('html').scrollTop();
            window.location.hash = current;
            $('html,body').scrollTop(scrollmem);
        });

        onTabChange(OCTOPRINT_INITIAL_TAB);
        onAfterTabChange(OCTOPRINT_INITIAL_TAB, undefined);

        var changeTab = function() {
            var hashtag = window.location.hash;
            if (!hashtag) return;

            var tab = $('#tabs').find('a[href="' + hashtag + '"]');
            if (tab) {
                tab.tab("show");
            }
        };

        // Fix input element click problems on dropdowns
        $(".dropdown input, .dropdown label").click(function(e) {
            e.stopPropagation();
        });

        // prevent default action for drag-n-drop
        $(document).bind("drop dragover", function (e) {
            e.preventDefault();
        });

        // reload overlay
        $("#reloadui_overlay_reload").click(function() { location.reload(); });

        //~~ final initialization - passive login, settings fetch, view model binding

        if (!_.has(viewModelMap, "settingsViewModel")) {
            throw new Error("settingsViewModel is missing, can't run UI");
        }

        if (!_.has(viewModelMap, "loginStateViewModel")) {
            throw new Error("loginStateViewModel is missing, can't run UI");
        }

        var bindViewModels = function() {
            log.info("Going to bind " + allViewModelData.length + " view models...");
            _.each(allViewModelData, function(viewModelData) {
                try {
                    if (!Array.isArray(viewModelData) || viewModelData.length !== 2) {
                        log.error("View model data for", viewModel.constructor.name, "has wrong format, expected 2-tuple (viewModel, targets), got:", viewModelData);
                        return;
                    }

                    var viewModel = viewModelData[0];
                    var targets = viewModelData[1];

                    if (targets === undefined) {
                        log.error("No binding targets defined for view model", viewMode.constructor.name);
                        return;
                    }

                    if (!_.isArray(targets)) {
                        targets = [targets];
                    }

                    try {
                        callViewModel(viewModel, "onBeforeBinding", undefined, true);
                    } catch (exc) {
                        log.error("Error calling onBeforeBinding on view model", viewModel.constructor.name, ":", (exc.stack || exc));
                        return;
                    }

                    if (targets !== undefined) {
                        if (!_.isArray(targets)) {
                            targets = [targets];
                        }

                        viewModel._bindings = [];

                        _.each(targets, function (target) {
                            if (target === undefined) {
                                log.error("Undefined target for view model", viewModel.constructor.name);
                                return;
                            }

                            var object;
                            if (!(target instanceof jQuery)) {
                                try {
                                    object = $(target);
                                } catch (exc) {
                                    log.error("Error while attempting to jquery-fy target", target, "of view model", viewModel.constructor.name, ":", (exc.stack || exc));
                                    return;
                                }
                            } else {
                                object = target;
                            }

                            if (object === undefined || !object.length) {
                                log.info("Did not bind view model", viewModel.constructor.name, "to target", target, "since it does not exist");
                                return;
                            }

                            var element = object.get(0);
                            if (element === undefined) {
                                log.info("Did not bind view model", viewModel.constructor.name, "to target", target, "since it does not exist");
                                return;
                            }

                            try {
                                ko.applyBindings(viewModel, element);
                                viewModel._bindings.push(target);

                                callViewModel(viewModel, "onBoundTo", [target, element], true);

                                log.debug("View model", viewModel.constructor.name, "bound to", target);
                            } catch (exc) {
                                log.error("Could not bind view model", viewModel.constructor.name, "to target", target, ":", (exc.stack || exc));
                            }
                        });
                    }

                    viewModel._unbound = viewModel._bindings === undefined || viewModel._bindings.length === 0;
                    viewModel._bound = viewModel._bindings && viewModel._bindings.length > 0;

                    callViewModel(viewModel, "onAfterBinding");
                } catch (exc) {
                    var name;
                    try {
                        name = viewModel.constructor.name;
                    } catch (exc) {
                        name = "n/a";
                    }
                    log.error("Error while processing view model", name, "for binding:", (exc.stack || exc));
                }
            });

            callViewModels(allViewModels, "onAllBound", [allViewModels]);
            log.info("... binding done");

            // startup complete
            callViewModels(allViewModels, "onStartupComplete");
            setOnViewModels(allViewModels, "_startupComplete", true);

            // make sure we can track the browser tab visibility
            OctoPrint.coreui.onBrowserVisibilityChange(function(status) {
                log.debug("Browser tab is now " + (status ? "visible" : "hidden"));
                callViewModels(allViewModels, "onBrowserTabVisibilityChange", [status]);
            });

            $(window).on("hashchange", function() {
                changeTab();
            });

            if (window.location.hash !== "") {
                changeTab();
            }

            log.info("Application startup complete");
        };

        var fetchSettings = function() {
            log.info("Finalizing application startup");

            //~~ Starting up the app
            callViewModels(allViewModels, "onStartup");

            viewModelMap["settingsViewModel"].requestData()
                .done(function() {
                    // There appears to be an odd race condition either in JQuery's AJAX implementation or
                    // the browser's implementation of XHR, causing a second GET request from inside the
                    // completion handler of the very same request to never get its completion handler called
                    // if ETag headers are present on the response (the status code of the request does NOT
                    // seem to matter here, only that the ETag header is present).
                    //
                    // Minimal example with which I was able to reproduce this behaviour can be found
                    // at https://gist.github.com/foosel/b2ddb9ebd71b0b63a749444651bfce3f
                    //
                    // Decoupling all consecutive calls from this done event handler hence is an easy way
                    // to avoid this problem. A zero timeout should do the trick nicely.
                    window.setTimeout(bindViewModels, 0);
                });
        };

        log.info("Initial application setup done, connecting to server...");

        /**
         * The following looks a bit complicated, so let me explain...
         *
         * Once we connect to the server (and that also includes consecutive reconnects), the
         * first thing we need to do is perform a passive login to a) establish a proper request
         * session with the server and b) figure out the login status of our client. That passive
         * login will be responded to with our session cookie and we must make absolutely sure that
         * this cannot be overridden by any concurrent requests. E.g. if we would send the passive
         * login request and also something like a settings fetch, the settings would not have the
         * cookie yet, hence the server would generate a new session for that request, and if the
         * response for the settings now arrives later than the passive login we'll get our
         * session cookie from that login directly overwritten again. That will not only lead to
         * us losing our login session with the server but also the client _thinking_ it is logged
         * in when in fact it isn't. See also #1881.
         *
         * So what we do here is ensure that we send the passive login request _and nothing else_
         * until that has been responded to and hence our session been properly established. Only
         * then we may trigger stuff like the various view model callbacks that might cause
         * additional requests.
         *
         * onServerConnect below takes care of the passive login. Only once that's completed it tells
         * our DataUpdater that it's ok to trigger any callbacks in view models. On the initial
         * server connect (during first initialization) we also trigger the settings fetch and
         * binding procedure once that's done, but only then.
         *
         * Or, as a fancy diagram: https://gist.githubusercontent.com/foosel/0cdc3a03cf5311804271f12e87293c0c/raw/abc84fdc3b13030d70961539d9c132ae39c32085/octoprint_web_startup.txt
         */

        var onServerConnect = function() {
            // Always perform a passive login on server (re)connect. No need for
            // onServerConnect/onServerReconnect on the LoginStateViewModel with this in place.
            return viewModelMap["loginStateViewModel"].requestData()
                .done(function() {
                    // Only mark our data updater as initialized once we've done our initial
                    // passive login request.
                    //
                    // This is to ensure that we have no concurrent requests triggered by socket events
                    // overriding each other's session during app initialization
                    dataUpdater.initialized();
                });
        };

        var dataUpdater = new DataUpdater(allViewModels);
        dataUpdater.connect()
            .done(function() {
                // make sure we trigger onServerConnect should we dis- and reconnect to the server
                dataUpdater.connectCallback = onServerConnect;

                // perform passive login first
                onServerConnect().done(function() {
                    // then trigger a settings fetch
                    window.setTimeout(fetchSettings, 0);
                });
            });
    }
);

;
