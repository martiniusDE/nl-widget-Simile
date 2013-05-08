
# vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

# @package     omeka
# @subpackage  neatline-Waypoints
# @copyright   2012 Rector and Board of Visitors, University of Virginia
# @license     http://www.apache.org/licenses/LICENSE-2.0.html


require 'rake/packagetask'
require 'fileutils'

class PackageTask < Rake::PackageTask

  def package_name
    @name
  end

  def basename
    @version ? "#{@name}-#{@version}" : @name
  end

  def tar_gz_file
    "#{basename}.tar.gz"
  end

  def zip_file
    "#{basename}.zip"
  end

end


PackageTask.new('NeatlineSimile') do |p|

  p.version     = IO.readlines('version')[0].strip
  p.need_tar_gz = true
  p.need_zip    = true

  # Configuration --
  p.package_files.include('plugin.php')
  p.package_files.include('plugin.ini')
  p.package_files.include('README.md')

  # Application --
  p.package_files.include('NeatlineSimilePlugin.php')
  p.package_files.include('models/**/*.php')
  p.package_files.include('controllers/**/*.php')
  p.package_files.include('views/**/*.php')
  p.package_files.include('helpers/**/*.php')

  # Payloads --
  p.package_files.include('views/**/payloads/**/*')
  p.package_files.include('views/**/payloads/**/*')

end
