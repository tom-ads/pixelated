import { Button } from '@/components'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const ProfileBanner = (): JSX.Element => {
  const { username } = useSelector((state: RootState) => ({
    username: state.auth.user?.username,
  }))

  return (
    <div className="bg-cyan-80 rounded-lg h-[115px] pl-40 flex relative items-center">
      <div className="rounded-full w-[106px] h-[106px] bg-white absolute left-8 translate-y-6"></div>
      <div className="max-w-lg truncate">
        <p className="text-3xl truncate">{username}</p>
        <Button
          variant="blank"
          className="text-yellow-60 hover:text-yellow-80 focus:text-yellow-80"
        >
          Manage
        </Button>
      </div>
    </div>
  )
}
