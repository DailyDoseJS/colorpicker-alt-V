import * as alt from "alt";

alt.on('keydown', (key) => {
    if (key === 46) { //DELETE KEY
	    alt.emit("openCP");
	}
});
//OPENS THE CP
alt.on('openCP', () => {
    
    //WEBVIEW STUFF
    var colorPicker = new alt.WebView("http://resource/client/colorpicker/html/index.html", false);
    colorPicker.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);

    //SETS METTALIC PRIMARY/SECONDARY COLOR
    colorPicker.on('setCarColor:ClientSide', (primary, secondary, color) => {
        let pearlId = 0;
        
        alt.emitServer("setCarColor:ServerSide", primary, secondary, color, pearlId);
        alt.showCursor(false);
        alt.toggleGameControls(true);
        colorPicker.unfocus();
        colorPicker.destroy();
    
    });
    
    //SETS METTALIC PRIMARY/SECONDARY LIVE IF CLICKED ON NORMAL
    colorPicker.on('setCarColorLive:ClientSide', (primary, secondary, color) => {
    
        let pearlId = 0;
        alt.emitServer("setCarColorLive:ServerSide", primary, secondary, color, pearlId);
    
    });

    //SETS MOD COLOR
    colorPicker.on('setModColor:ClientSide', (colorId, primary, secondary) => {
      
        let pearlId = 0;
        alt.emitServer("setModColor:ServerSide", colorId, primary, secondary, pearlId);
    
    });


    //SETS MOD COLOR
    colorPicker.on('setModColor:ClientSide', (colorId, primary, secondary) => {

        let pearlId = 0;
        alt.emitServer("setModColor:ServerSide", colorId, primary, secondary, pearlId);
    
    });

    //SETS PEARL COLOR
    colorPicker.on('setPearlColor:ClientSide', (colorId) => {
      
        alt.emitServer("setPearlColor:ServerSide", colorId);
    
    });
    
    //SETS PEARL COLOR LIVE
    colorPicker.on('setPearlColorLive:ClientSide', (colorId) => {
      
        alt.emitServer("setPearlColorLive:ServerSide", colorId);
    
    });

    //CANCEL SET COLOR
    colorPicker.on('cancelSetColor:ClientSide', () => {

        alt.showCursor(false);
        alt.toggleGameControls(true);
        colorPicker.unfocus();
        colorPicker.destroy();
        alt.setTimeout(() => {
        alt.emitServer("cancelSetColor:ServerSide");

        }, 5);
    });

});