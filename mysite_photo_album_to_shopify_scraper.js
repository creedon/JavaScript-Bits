// Code to scrape some MySite photo album pages and format the data in Shopify format

var brk;
var data;
var imageNameTranslations;
var newscript = document.createElement ( 'script' );
var output;
var url;
var urlArray;

// Add jQuery into this webpage

newscript.type = 'text/javascript';
newscript.src = '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js';

( document.getElementsByTagName ( 'head' ) [ 0 ] || document.getElementsByTagName ( 'body' ) [ 0 ] ).appendChild ( newscript );

function buildEntry ( ) {

    var imageUrl = 'http://64.136.20.22/' + urlArray [ urlArray.length - 1 ] + '_l.JPG';
    var td = $( '.tablerow1 td:first', $page );
    
    var comment = $( 'div.textarea', td ).text ( ).trim ( ).replace ( /�/g, '"' ).replace ( /[ \t]+/g, ' ' ).replace ( /\s*\n+\s*/g, '<br />' );
    var description = $( 'h3', td ).text ( ).trim ( ).replace ( /^"/, '' ).replace ( /"$/, '' );
    var t = description.split ( ' - ' );
    var title = t [ 0 ].trim ( ); t.splice ( 0, 1 );
    var varientPrice = t [ t.length - 1 ].trim ( ).replace ( /\$/, '' ); t.splice ( t.length - 1, 1 );
    
    var bodyHtml = ( t.length ) ? '<ul><li>' + t.join ( '</li><li>' ).replace ( /�/g, '"' ).replace ( /[ \t]+/g, ' ' ).replace ( /\s*\n+\s*/g, '<br />' ) + '</li></ul>' : '';
    var handle = title.replace ( /[\s\W]/g, '-' ).replace ( /-+/g, '-' ).replace ( /-+$/g, '' ).toLowerCase ( );
    
    if ( ! ( handle in data ) ) {
    
    	data [ handle ] = { 'title' : title, bodyHtml : bodyHtml, 'commentArray' : [ ], 'variantGrams' : '', 'variantPrice' : varientPrice, imgSrcArray : [ ] };
    	
        t.forEach ( function ( element, index, array ) {
    
            var t = element.match ( /([0-9]+)\s*(lbs|g)/ );
        
            if ( t ) {
        
                if ( t [ 2 ] == 'lbs' )
            
                    t [ 1 ] = t [ 1 ] / 0.0022046;
                	
                data [ handle ] [ 'variantGrams' ] = t [ 1 ];
                
            	}
    		} );
    	}
    	
    data [ handle ].imgSrcArray.push ( imageUrl );
    
    if ( comment )
    
    	data [ handle ].commentArray.push ( 'Picture ' + data [ handle ].imgSrcArray.length + ' comment : ' + comment );
    	
    // build image name translation
    
    imageNameTranslations = imageNameTranslations + url.match ( /.+\/(.+$)/ ) [ 1 ] + '\t' + title + '\t' + handle + '\t' + imageUrl + '\n';
    
    }

function encodeCsvField ( s ) {

	return s.replace ( /"/g, '""' ).replace ( /,/g, '\,' );
	
	}

function getNextPageUrl ( ) {

    var url = $( ".sidebar_link.linkitem:contains('Next >')", $page ).attr ( 'href' );
    
    if ( url )
    
        url = 'http://www.carlsdisplayminerals.com' +  url
        
    return url
    
    }

function parseData ( ) {

	for ( k in data ) {
	
		var o = data [ k ];
		
		$.each ( o.imgSrcArray, function ( index ) {
		
			var bodyHtml = '';
			var title = '';
			var variantGrams = '';
			var variantPrice = '';
		
			if ( index == 0 ) {
			
				bodyHtml = encodeCsvField ( ( o.bodyHtml + '<br />' + o.commentArray.join ( '<br />' ) ).replace ( /</g, '&lt;' ).replace ( />/g, '&gt;' ) );
				title = encodeCsvField ( o.title );
				variantGrams = o.variantGrams;
				variantPrice = o.variantPrice;
				
				}
				
	    	output = output + k + ',"' + title + '","' + bodyHtml + '",,,,TRUE,,,,,,,,' + variantGrams + ',,1,deny,manual,' + variantPrice + ',,TRUE,FALSE,,' + this + ',,FALSE\n';
	    
	    	} );
	    }
	}

function scrape ( args ) {

	brk = false;
	data = { };
	imageNameTranslations = '';
    output = 'Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Alt Text,Gift Card\n';
    url = document.location.href;
    
    console.log ( 'Using jQuery version ' + $.fn.jquery + '.' );
    
    while ( url ) {
    
        console.log ( 'url : ' + url );
        
	    urlArray = url.split ( '/' );
	    
        $.ajax ( {
        
            url : url,
            
            success : function ( data ) {
            
                $page = $( data );
                
                buildEntry ( );
                
                },
                
            async : false,
            
            error : function ( x, s, e ) {
            
                console.log ( 'e' );
                
                alert ( 'error' );
            
                }
                
            } );
            
        url = getNextPageUrl ( );
        
        console.log ( 'next url : ' + url );
        
		debugger;
	
        if ( brk )
        
        	break;
    }
    
	parseData ( );
	
    var w = window.open ( );

    w.document.write ( '<pre>' + output + '</pre>' );
    
    w = window.open ( );

    w.document.write ( '<pre>' + imageNameTranslations + '</pre>' );
    
    }
