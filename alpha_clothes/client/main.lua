TriggerEvent('esx:getSharedObject', function(obj)
    ESX = obj
end)

isInInventory = false

CreateThread(function()
    while true do
        Wait(0)
        if IsControlJustReleased(0, Config.OpenControl) and IsInputDisabled(0) then
            openInventory()
        end

        if isInInventory then
            DisableAllControlActions(0)

            EnableControlAction(0, "INPUTGROUP_MOVE", true)
            EnableControlAction(0, 30, true)
            EnableControlAction(0, 31, true)
            EnableControlAction(0, 245, true)
        end
    end
end)

function openInventory()
    loadPlayerInventory()
    isInInventory = true
    
    SendNUIMessage({
        action = "display",
        type = "normal"
    })
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
end

function closeInventory()
    isInInventory = false
    SendNUIMessage(
        {
            action = "hide"
        }
    )
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    ClearPedSecondaryTask(PlayerPedId())
end

RegisterNUICallback('NUIFocusOff', function()
    closeInventory()
end)

function loadPlayerInventory()
    ESX.TriggerServerCallback("alpha_clothes:getPlayerInventory", function(data)

        SendNUIMessage({
            action = "setItems",
            itemList = items,
            fastItems = fastItems
        })
    end, GetPlayerServerId(PlayerId()))
end

AddEventHandler('onResourceStart', function()
    Wait(750)
    ESX.TriggerServerCallback('alpha_clothes:getAllItems', function(items)
        itemsDB = items
    end)
end)


--ALPHA VETEMENT Menu--

local authorizedEvents = {'qb-radialmenu:ToggleProps', 'qb-radialmenu:ToggleClothing'}

function isAuthorized(event)
    for k,v in pairs(authorizedEvents) do
        if v == event then
            return true
        end
    end
    return false
end

-- ALPHA VETEMENT Menu

RegisterNUICallback('inventory_options', function(data)
    local isAuthorized = isAuthorized(data.event)
    if isAuthorized then
        data.action = data.action or ''
        TriggerEvent(data.event, data.action)
    else
        print('~r~Une erreur est survenue')
    end
end)