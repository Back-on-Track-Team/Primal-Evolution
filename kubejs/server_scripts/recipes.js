var seed
var log = []

// Mod shortcuts
let MOD = (domain, id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let AE2 = (id, x) =>MOD("ae2", id, x)
let TE = (id, x) => MOD("thermal", id, x)
let XT = (id, x) => MOD("create_mechanical_extruder", id, x)
let AP = (id, x) => MOD("architects_palette", id, x)
let CR = (id, x) => MOD("create", id, x)
let GB = (id, x) => MOD("gearbox", id, x)
let MC = (id, x) => MOD("minecraft", id, x)
let KJ = (id, x) => MOD("kubejs", id, x)
let ES = (id, x) => MOD("enderstorage", id, x)
let FD = (id, x) => MOD("farmersdelight", id, x)
let SD = (id, x) => MOD("storagedrawers", id, x) 
let SP = (id, x) => MOD("supplementaries", id, x)
let F = (id, x) =>  MOD("forge", id, x)
let WT = (id, x) =>  MOD("waystones", id, x)
let PP = (id, x) => MOD("prettypipes", id, x)
let ED = (id, x) => MOD("endersdelight", id, x)
let AD = (id, x) => MOD("ad_astra", id, x)
let CC = (id, x) => MOD("create_connected", id, x)
let AL = (id, x) => MOD("alloyed", id, x)
let SS = (id, x) => MOD("sophisticatedstorage", id, x)
let SB = (id, x) => MOD("sophisticatedbackpacks", id, x)
let CP = (id, x) => MOD("chipped", id, x)
let MOL = (id, x) => MOD("morelights", id, x)

let colors = ['white', 'orange', 'magenta', 'light_blue', 'lime', 'pink', 'purple', 'light_gray', 'gray', 'cyan', 'brown', 'green', 'blue', 'red', 'black', 'yellow']
let native_metals = ['iron', 'zinc', 'lead', 'copper', 'nickel', 'gold']
let wood_types = [MC('oak'), MC('spruce'), MC('birch'), MC('jungle'), MC('acacia'), MC('dark_oak'), MC('crimson'), MC('warped'), AP('twisted')]

let donutCraft = (event, output, center, ring) => {
	event.shaped(output, [
		'SSS',
		'SCS',
		'SSS'
	], {
		C: center,
		S: ring
	})
}

ServerEvents.recipes(event => {
	log.push('Registering Recipes')

	oreProcessing(event)
	CreateUniversal(event)

	log.push('Recipes Updated')
})

ServerEvents.tags('block', event => {
  let tweak_casing = (r) => {
	event.add('create:wrench_pickup', r)
	}
	tweak_casing('kubejs:zinc_casing')
	tweak_casing('kubejs:enderium_casing')
	tweak_casing('kubejs:invar_casing')
	tweak_casing('kubejs:fluix_casing')
})

ServerEvents.tags('item', event => {
	colors.forEach(element => {
		event.get(F('glazed_terracotta')).add(MC(`${element}_glazed_terracotta`))
	});

	global.trades.forEach(element => {
		event.get('forge:trade_cards').add(`kubejs:trade_card_${element}`)
		event.get('thermal:crafting/dies').add(`kubejs:trade_card_${element}`)
	});
	
	global.professions.forEach(element => {
		event.get('forge:profession_cards').add(`kubejs:profession_card_${element}`)
		event.get('thermal:crafting/dies').add(`kubejs:profession_card_${element}`)
	});

	event.get("forge:circuit_press")
		.add(AE2("name_press"))
		.add(AE2("silicon_press"))
		.add(AE2("logic_processor_press"))
		.add(AE2("engineering_processor_press"))
		.add(AE2("calculation_processor_press"))

	event.get('forge:super_glues').add(CR('super_glue'))
	event.get('forge:wrenches').add(CR('wrench'))
	event.get('forge:tools/wrench').add(CR('wrench'))
	event.get('forge:soldering_irons').add(KJ('soldering_iron'))
	event.get('forge:ingots/steel').add("alloyed:steel_ingot")
	event.get('forge:storage_blocks/steel').add("alloyed:steel_block")

	event.get('create:upright_on_belt')
		.add(AE2("red_paint_ball"))
		.add(AE2("yellow_paint_ball"))
		.add(AE2("green_paint_ball"))
		.add(AE2("blue_paint_ball"))
		.add(AE2("magenta_paint_ball"))
		.add(AE2("black_paint_ball"))

	let remove_metal =(ingot, block, nugget, type, substitute)=>{
		event.remove('forge:ingots/' + type, ingot)
		event.remove('forge:ingots', ingot)

		event.remove('balm:ingots', ingot)

		event.remove('forge:nuggets/' + type, nugget)
		event.remove('forge:nuggets', nugget)

		event.remove('forge:storage_blocks/' + type, block)
		event.remove('forge:storage_blocks', block)
	}

	remove_metal(TE('steel_ingot'), 			TE('steel_block'), 				TE('steel_nugget'), 		    'steel')
	remove_metal('davebuildingmod:steel_ingot', 'davebuildingmod:steel_block', 	'', 						    'steel')
	remove_metal('createdeco:cast_iron_ingot',  'createdeco:cast_iron_nugget',  'createdeco:cast_iron_block',	'cast_iron')

	remove_metal(TE('bronze_ingot'), TE('bronze_block'), TE('bronze_nugget'), 'bronze')
	remove_metal(TE('electrum_ingot'), TE('electrum_block'), TE('electrum_nugget'), 'electrum')

	let remove_thermal_plate = (type) =>{
		event.remove("forge:plates", TE(type+'_plate'))
		event.remove("forge:plates/"+type, TE(type+'_plate'))
	}

	let remove_thermal_set = (dust, gear, plate, type)=>{
		event.remove('forge:dusts', dust)
		event.remove('forge:dusts/'+type, dust)

		event.remove('forge:gears', gear)
		event.remove('forge:gears/'+type, gear)

		event.remove('forge:plates', plate)
		event.remove('forge:plates/'+type, plate)
	}
	remove_thermal_set(TE('bronze_dust'), TE('bronze_gear'), TE('bronze_plate'),            'bronze')
  remove_thermal_set(TE('electrum_dust'), TE('electrum_gear'), TE('electrum_plate'),     'electrum')

	remove_thermal_plate('iron')
	remove_thermal_plate('gold')
	remove_thermal_plate('copper')
	remove_thermal_plate('netherite')

	event.remove('forge:dusts/diamond', 'createaddition:diamond_grit')
	event.remove('forge:dusts', 'createaddition:diamond_grit')

	event.remove('forge:plates/zinc', 'createaddition:zinc_sheet')
	event.remove('forge:plates', 'createaddition:zinc_sheet')

})

function oreProcessing(event){
}

function CreateUniversal(event){
	event.remove({ mod: 'create_mechanical_extruder' })
	event.remove({ mod: 'create_connected' })
	event.remove({ mod: 'createaddition' })
	event.remove({ mod: 'createdeco' })
	event.remove({ mod: 'createcasing' })
	event.remove({ mod: 'create_jetpack' })
	event.remove({ mod: 'sliceanddice' })
	event.remove({ mod: 'create' })
	event.remove({ mod: 'alloyed' })
	event.remove({ mod: 'bellsandwhistles' })
	event.remove({ mod: 'create_central_kitchen' })
	event.remove({ mod: 'createframed' })
	event.remove({ mod: 'extra_gauges' })
	event.remove({ mod: 'createstockbridge' })
	event.remove({ mod: 'createterminal' })
	event.remove({ mod: 'projectred_core' })
	event.remove({ mod: 'projectred_integration' })
	event.remove({ mod: 'projectred_transmission' })
	event.remove({ mod: 'thermal' })
	event.remove({ mod: 'thermalendergy' })
  event.remove({ mod: 'ae2' })

		let tweak_casing = (r, i1, i2, tag) => {
		event.remove({ output: r })
		if(tag){
			event.custom({
				"type": "create:item_application",
				"ingredients": [
					{ "tag": i2 },
					{ "item": i1 }],
				"results": [
					{ "item": r }]})
		}else{
			event.custom({
				"type": "create:item_application",
				"ingredients": [
					{ "item": i2 },
					{ "item": i1 }],
				"results": [
					{ "item": r }]})}}

	tweak_casing(CR('andesite_casing'), 	CR('andesite_alloy'), MC('logs'), true)
	tweak_casing(CR('copper_casing'), 	CR('copper_sheet'), 	MC('logs'), true)
	tweak_casing(CR('brass_casing'), 	CR('brass_sheet'), 	MC('logs'), true)
  tweak_casing(CR('railway_casing'), 	CR('sturdy_sheet'), 	MC('logs'), true)
	tweak_casing(AL('steel_casing'), 	AL('steel_sheet'), 	MC('logs'), true)
	tweak_casing(KJ('zinc_casing'), 		'createdeco:zinc_sheet', MC('logs'), true)
	tweak_casing(KJ('enderium_casing'), TE('enderium_plate'), MC('logs'), true)
	tweak_casing(KJ('invar_casing'), 	TE('invar_plate'), 	MC('logs'), true)
	tweak_casing(KJ('fluix_casing'), 	TE('lead_plate'), 	MC('logs'), true)
}