//Fonction Create ID

function getRandomInt( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

function createId(charsValue, segmentsValue) {
    var tokens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        chars = charsValue, //5
        segments = segmentsValue, //1 ou 4
        result = "";
        
    for( var i = 0; i < segments; i++ ) {
        var segment = "";
        
        for( var j = 0; j < chars; j++ ) {
            var k = getRandomInt( 0, 35 );
            segment += tokens[ k ];
        }
        
        result += segment;
        
        if( i < ( segments - 1 ) ) {
            result += "-";
        }
    }
    
    return result;

}


module.exports = createId; 


	
    
	