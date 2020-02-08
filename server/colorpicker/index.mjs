import * as alt from 'alt-server';

alt.onClient('setCarColorLive:ServerSide', (player, primary, secondary, color, pearlId) => {
    if(player.vehicle){
        
        if(primary && !secondary){
            player.vehicle.customPrimaryColor = color;
            player.vehicle.pearlColor = pearlId;
			//Just Live Edit
        }

        if(secondary && !primary){
            player.vehicle.customSecondaryColor = color;
            player.vehicle.pearlColor = pearlId;
			//Just Live Edit
        }

        if(primary && secondary) {
            player.vehicle.customPrimaryColor = color;
            player.vehicle.customSecondaryColor = color;
            player.vehicle.pearlColor = pearlId;
			//Just Live Edit
        }
    }
});
alt.onClient('setPearlColor:ServerSide', (player, colorId) => {
    if(player.vehicle){
        player.vehicle.pearlColor = colorId;

        //Insert Notify Pearl Set
		//And do maybe database stuff to update the pearlcolor on the vehicle
    }
});

alt.onClient('setPearlColorLive:ServerSide', (player, colorId) => {
    if(player.vehicle){
        player.vehicle.pearlColor = colorId;
    }
});

alt.onClient('setCarColor:ServerSide', (player, primary, secondary, pearlId) => {
    
    if(player.vehicle){
    
        if(primary && !secondary){

            //Insert Notify Primary/Secondary Set
			//And do maybe database stuff to update the color on the vehicle
            player.setSyncedMeta('colorpicker', 'closed');
            player.vehicle.pearlColor = pearlId;

        }
        
        
        if(secondary && !primary){

            //Insert Notify Secondary Set
			//And do maybe database stuff to update the color on the vehicle
            player.setSyncedMeta('colorpicker', 'closed');
            player.vehicle.pearlColor = pearlId;
            

        }
        
        if(primary && secondary){
            
            //Insert Notify Primary/Secondary Set
			//And do maybe database stuff to update the color on the vehicle
            player.setSyncedMeta('colorpicker', 'closed');
            player.vehicle.pearlColor = pearlId;

        }
        if(!primary && !secondary) {
		    // Notify here primary or secondary must be active to set color
        }
    
    } else {

        return;
    }
});

//SET ModColor
alt.onClient('setModColor:ServerSide', (player, colorId, primary, secondary, pearlId) => {
    if(player.vehicle){
        if(primary && secondary){
        
            player.vehicle.primaryColor = colorId;
            player.vehicle.secondaryColor = colorId;
            player.vehicle.pearlColor = pearlId;
			//Insert notify here primary/secondary set
        
        }

        if(primary && !secondary){

            player.vehicle.primaryColor = colorId;
            player.vehicle.pearlColor = pearlId;
			//Insert notify here primary set
        
        }

        if(!primary && secondary){
    
            player.vehicle.secondaryColor = colorId;
            player.vehicle.pearlColor = pearlId;
            //Insert notify here secondary set
    
        }

        if(!primary && !secondary){
    
            //Insert notify here primary or secondary must be active to set the color
			return;
    
        }
    }
});

//GETS OLD COLOR 
alt.onClient('cancelSetColor:ServerSide', (player) => {
    player.setSyncedMeta('colorpicker', 'closed');
	//Do youre Stuff
});

//Display Error
alt.onClient('cpError:ServerSide', (player) => {
    //Put here a error message in example a notify to the player
});