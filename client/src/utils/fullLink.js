import {backend} from "../apis";

export default function (link) {
  if(link){
    if(link.startsWith("http")){
      return link
    } else {
      return backend + "/" + link
    }
  }
}