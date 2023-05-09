var Config = new Object();
var type = "normal";

Config.closeKeys = [113, 27, 288];

window.addEventListener("message", function (event) {
    if (event.data.action == "display") {

        type = event.data.type

        disabled = false;

        const data = event.data

        if (type === "normal") {
            $(".menu-lateral .boton").off("click").on("click", function(){
                let action = $(this).attr("action");
                let event = $(this).attr("event");
                $.post('https://alpha_clothes/inventory_options', JSON.stringify({event: event, action: action}));
            });
        }

        $(".ui").fadeIn();
    } else if (event.data.action == "hide") {
        $("#dialog").dialog("close");
        $(".ui").fadeOut();
        $(".item").remove();
    } else if (event.data.action == "setItems") {
        inventorySetup(event.data.itemList,event.data.fastItems);

        $('.item').draggable({
            helper: 'clone',
            appendTo: 'body',
            zIndex: 99999,
            revert: 'invalid',
            start: function (event, ui) {
                if (disabled) {
                    return false;
                }
            }
        });
    }
});

function closeInventory() {
    $.post("http://alpha_clothes/NUIFocusOff", JSON.stringify({}));
}

function disableInventory(ms) {
    disabled = true;

    if (disabledFunction === null) {
        disabledFunction = new Interval(ms);
        disabledFunction.start();
    } else {
        if (disabledFunction.isRunning()) {
            disabledFunction.stop();
        }

        disabledFunction.start();
    }
}

function setCount(item, second) {
    if (second && type === "shop") {
        return "$" + formatMoney(item.price);
    }

    count = item.count

    if (item.limit > 0) {
        count = item.count + " / " + item.limit;
    }


    if (item.type === "item_weapon") {
        if (count == 0) {
            count = "";
        } 
    }

    if (item.type === "item_account" || item.type === "item_money") {
        count = (item.count + '$');
    }

    return count;
}

$(document).ready(function () {
    $("#count").focus(function () {
        $(this).val("")
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).val("1")
        }
    });

    $("body").on("keyup", function (key) {
        if (Config.closeKeys.includes(key.which)) {
            closeInventory();
        }
    });

    $("#count").on("keypress keyup blur", function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
});

$.widget('ui.dialog', $.ui.dialog, {
    options: {
        clickOutside: false,
        clickOutsideTrigger: ''
    },
    open: function () {
        var clickOutsideTriggerEl = $(this.options.clickOutsideTrigger),
            that = this;
        if (this.options.clickOutside) {
            $(document).on('click.ui.dialogClickOutside' + that.eventNamespace, function (event) {
                var $target = $(event.target);
                if ($target.closest($(clickOutsideTriggerEl)).length === 0 &&
                    $target.closest($(that.uiDialog)).length === 0) {
                    that.close();
                }
            });
        }
        this._super();
    },
    close: function () {
        $(document).off('click.ui.dialogClickOutside' + this.eventNamespace);
        this._super();
    },
});
