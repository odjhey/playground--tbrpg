import http from 'k6/http'
import {sleep} from 'k6'

export default function () {

  http.get('http://localhost:5173/trpc/longPoll.ping?batch=1&input=%7B%7D')

}
