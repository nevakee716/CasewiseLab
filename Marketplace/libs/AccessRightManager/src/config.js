var configEditForbiddenPropertiesByViewAndRole = {
  process: { // nom de la vue
    1: ['name','type'] // id du role, et tableau avec les propriétés impossible à modifier
  }
};

var configReadForbiddenPropertiesByViewAndRole = {
  process: { // nom de la vue
    process : { // scriptname de l'objet type
      1: ['criticité'] // id du role, et tableau avec les propriétés impossible à lire
    }
  }
};