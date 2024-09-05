export function dumpMap(name, map){
    let iterator = map.entries();
  
    let message = name + "\n"
  
    for(let i = 0; i < map.size; i++){
      let v = iterator.next().value
      let newMess = v[0];

      if(v[1]._localID){
        newMess += " - " + v[1]._localID;
      }

      if(v[1]._name){
        newMess += " - " + v[1]._name;
      }
      
      message += newMess + '\n'
    }
  
    console.log(message);
}