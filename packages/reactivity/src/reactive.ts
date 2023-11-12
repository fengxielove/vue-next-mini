// 创建一个代理对象
import { mutableHandlers } from './baseHandlers'

export const reactiveMap = new WeakMap<object, any>()

export function reactive(target: object) {
	return createReactiveObject(target, mutableHandlers, reactiveMap)
}

function createReactiveObject(target: object, baseHandlers: ProxyHandler<any>, proxyMap: WeakMap<object, any>) {
	// 先检查是否已经存在此代理对象
	const existingProxy = proxyMap.get(target)
	if (existingProxy) {
		return existingProxy
	}
	// 否则创建新的代理对象
	const proxy = new Proxy(target, baseHandlers)
	proxyMap.set(target, proxy)
	return proxy
}
