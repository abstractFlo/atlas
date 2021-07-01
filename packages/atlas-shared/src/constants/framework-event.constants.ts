// Internal Event Names
export const FrameworkEvent = {
  EventService: {
    EmitGuiEvent: 'event:emit:gui:event',
    ServerEmitGui: 'server:emit:gui',
    GuiOn: 'gui:on',
    GuiEmitServer: 'gui:emit:server',
    GuiChangeRoute: 'gui:change:route',
    GuiShowCursor: 'gui:show:cursor',
    GuiRemoveCursor: 'gui:remove:cursor',
    GuiRemoveAllCursors: 'gui:removeAll:cursor',
    GuiFocus: 'gui:focus',
    GuiUnfocus: 'gui:unfocus',
  },
  Discord: {
    AuthDone: 'express:discordUser:accessDone',
  },
  Player: {
    SetRealTime: 'player:set:realtime',
  },
};
