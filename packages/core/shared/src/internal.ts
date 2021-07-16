export const Internal = {
	// Timers
	Alt_Set_Timeout: Symbol('alt.setTimeout'),
	Alt_Clear_Timeout: Symbol('alt.clearTimeout'),
	Alt_Set_Interval: Symbol('alt.setInterval'),
	Alt_Clear_Interval: Symbol('alt.clearInterval'),
	Alt_Next_Tick: Symbol('alt.nextTick'),
	Alt_Clear_Next_Tick: Symbol('alt.clearNextTick'),
	Alt_Every_Tick: Symbol('alt.everyTick'),
	Alt_Clear_Every_Tick: Symbol('alt.clearEveryTick'),

	// Logs
	Alt_Log: Symbol('alt.log'),
	Alt_Log_Error: Symbol('alt.logError'),
	Alt_Log_Warning: Symbol('alt.logWarning'),

	// EventEmitter
	Alt_On: Symbol('alt.on'),
	Alt_Once: Symbol('alt.once'),
	Alt_Off: Symbol('alt.off'),
	Alt_Emit: Symbol('alt.emit'),

	//TimerManager
	Timer_Manager: Symbol('framework:timers'),

	// Events
	Events_On: 'events:on',
	Events_Once: 'events:once',
	Events_On_Server: 'events:onServer',
	Events_On_Client: 'events:onClient',
	Events_Once_Client: 'events:onceClient',
	Events_Once_Server: 'events:onceServer',
	Events_On_Gui: 'events:onGui',
	Events_Game_Entity_Create: 'events:gameEntityCreate',
	Events_Game_Entity_Destroy: 'events:gameEntityDestroy',
	Events_Stream_Synced_Meta_Change: 'events:streamSyncedMetaChange',
	Events_Synced_Meta_Change: 'events:syncedMetaChange',
	Events_Entity_Enter_Col_Shape: 'events:entityEnterColShape',
	Events_Entity_Leave_Col_Shape: 'events:entityLeaveColShape',
	Events_Console_Command: 'events:consoleCommand',
	Events_Key_Up: 'events:keyUp',
	Events_Key_Down: 'events:keyDown',

	// Webview
	Webview_Emit_Gui_Event: 'event:emit:gui:event',
	Webview_Server_Emit_Gui: 'server:emit:gui',
	Webview_Gui_On: 'gui:on',
	Webview_Gui_Emit_Server: 'gui:emit:server',
	Webview_Gui_Change_Route: 'gui:change:route',
	Webview_Gui_Show_Cursor: 'gui:show:cursor',
	Webview_Gui_Remove_Cursor: 'gui:remove:cursor',
	Webview_Gui_Remove_All_Cursors: 'gui:remove:allCursors',
	Webview_Gui_Focus: 'gui:focus',
	Webview_Gui_Un_Focus: 'gui:unfocus'
};
