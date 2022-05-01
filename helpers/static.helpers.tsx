import { createContext, useContext } from "react";

export const MicroCMSContext = createContext({});

export const withMicroCMS = (Component: any) => {
    const inject = (props: any) => {
        if (props.__next_ssg_error) {
            return <h1>{props.__next_ssg_error} Error</h1>
        }
        return <MicroCMSContext.Provider value={props.__next_ssg_data || {}}>
            <Component {...props} />
        </MicroCMSContext.Provider>
    }
    return inject;
}


const MicroCMS = ({ endpoint, children }: any) => {
  const data = useContext(MicroCMSContext) as any;

  // プリレンダリング時はここがtrueにならない
  if (typeof data[endpoint] !== 'undefined') {
    if (typeof children === 'function') {
      return children(data[endpoint])
    }

    return data[endpoint]
  }

  const IS_SSG =
    typeof window === 'undefined' &&
    typeof global !== 'undefined' &&
    // @ts-ignore
    global.__next_ssg_requests;

  // SSGの場合、グローバルな配列にpushする
  if (IS_SSG) {
    // @ts-ignore
    global.__next_ssg_requests.push(endpoint)
  }

  return null
}

