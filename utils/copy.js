import { message } from 'antd'
import copy from 'copy-to-clipboard'

export default function Copy(string){
  try {
    copy(string)
    message.info('复制成功', 3)
  } catch(e) {
    message.info('复制失败', 3)
  }
}