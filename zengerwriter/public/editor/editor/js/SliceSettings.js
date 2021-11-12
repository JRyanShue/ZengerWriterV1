/*
    Setting the variables in this class will change the global slicing variables
*/

class SliceSettings {

    constructor() {
        
        // set default print settings

        this.dict = {

            // QUALITY
            "quality" : {
                "layer_height" : 0.2,
                "line_width" : 0.4
            },
            
            // SHELL
            "shell" : {
                "wall_thickness" : 0.8,
                "top_bottom_thickness" : 0.8,
                "top_bottom_pattern" : "lines",
                "xy_offset" : -0.1,  // Horizontal Expansion
                "xy_offset_layer_0" : -0.2,
            },            

            // INFILL
            "infill" : {
                "infill_sparse_density" : 20,
                "infill_pattern" : "grid",
            },            
            
            // TEMPERATURE
            "material" : {
                "material_print_temperature" : 205,
                "material_bed_temperature" : 50,
                "material_flow" : 100
            },            

            // SPEED 
            "speed" : {
                "speed_print" : 50,
                "speed_wall" : 25,
                "speed_topbottom" : 25,
                "speed_travel" : 150,
                "speed_layer_0" : 20,
                "speed_travel_layer_0" : 100,
            },            

            // TRAVEL
            "travel" : {
                "retraction_enable" : true,
                "retraction_amount" : 6,
                "retraction_speed" : 45,
                "retraction_combing" : "all",
            },
            
            // COOLING
            "cooling" : {
                "cool_fan_speed" : 100,
                "cool_fan_speed_0" : 0,
            },
            
            // SUPPORT 
            "support" : {
                "support_enable" : true,
                "support_structure" : "normal",
                "support_type" : "buildplate",
                "support_angle" : 65,
                "support_infill_rate" : 10,
                "support_z_distance" : 0.2,
                "support_xy_distance" : 0.8
            },            

            // BUILD PLATE ADHESION
            "build plate adhesion" : {
                "adhesion_type" : "skirt"
            }

        }

    }

    set ( formData ) {

        for ( var category in this.dict ) {

            for ( var setting in this.dict[category] ) {

                console.log( setting, ":", this.dict[ category ][ setting ] );
                formData.append( setting, this.dict[ category ][ setting ] ); 

            }
            
        }

    }

}

export { SliceSettings }