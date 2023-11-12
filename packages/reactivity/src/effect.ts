import { createDep, Dep } from './dep'
import { isArray } from '@vue/shared'
// type KeyToDepMap = Map<any, ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
// 存储所有的依赖数据
const targetMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
	const _effect = new ReactiveEffect(fn)

	_effect.run()
	console.log('activeEffect', activeEffect)
}


export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
	constructor(public fn: () => T) {
	}

	run() {
		activeEffect = this
		return this.fn()
	}

}

/**
 * 收集依赖
 * 收集依赖主要是实现 完成指定对象到指定属性 到对应的 fn 的一个关系绑定,
 * 				fn 是一个 ReactiveEffect (被一个全局变量所保存)
 * 			  所以如果 ReactiveEffect 值存在，即代表有需要被收集的数据
 * - 先检查 targetMap 中是否存在需要收集的target
 *   - 再检查 key 是否也已经存在
 * @param target
 * @param key
 */
export function track(target: object, key: unknown) {
	console.log('收集依赖')
	if (!activeEffect) return
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()))
	}

	let dep = depsMap.get(key)
	if (!dep) {
		depsMap.set(key, (dep = createDep()))
	}
	trackEffects(dep)
	// depsMap.set(key, activeEffect)
}

/**
 * 利用 dep 依次跟踪 指定key 的所有 effect
 * @description dep
 */
export function trackEffects(dep: Dep) {
	dep.add(activeEffect!)
}

/**
 * 触发依赖
 * @param target
 * @param key
 * @param newValue
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
	console.log('触发依赖')
// 	查找收集的依赖关系
	const depsMap = targetMap.get(target)
	if (!depsMap) return

	// 处理单依赖
	// const _effect = depsMap.get(key) as ReactiveEffect
	// if (!_effect) return
	// _effect.fn()

	// 处理多 依赖
	const dep: Dep | undefined = depsMap.get(key)
	if (!dep) return
	triggerEffects(dep)
}

/**
 * 依次触发 dep 中保存的依赖
 * @param dep
 */
export function triggerEffects(dep: Dep) {
	const effects = isArray(dep) ? dep : [...dep]
	for (const effect of effects) {
		triggerEffect(effect)
	}
}

export function triggerEffect(effect: ReactiveEffect) {
	effect.run()
}
